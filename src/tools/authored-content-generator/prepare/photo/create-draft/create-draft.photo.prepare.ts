// src/tools/authored-content-generator/prepare/photo/create-draft/create-draft.photo.prepare.ts

import { parse } from "node:path";

import type {
  PhotoAssetAuthored,
  PhotoResolvedLocationAuthored,
} from "../../../../../content-schema/assets/photo/photo.asset.content-schema.authored.type";

import type { ExtractedPhotoExif } from "../exif/exif.photo.prepare";

import { resolvePhotoTimezone } from "../location/location.photo.prepare";
import { personConfigAuthored } from "../../../../../shared/config/person.config.shared.authored";

const REQUIRED_PLACEHOLDER = "__REQUIRED__";

export const toPhotoId = (fileName: string): string =>
  parse(fileName)
    .name.toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const toTitleFromFileName = (fileName: string): string =>
  parse(fileName)
    .name.replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/(^|\s)\w/g, (char) => char.toUpperCase());

const requiredNumber = (
  value: number | null,
  field: string,
  fileName: string,
): number => {
  if (value === null) {
    throw new Error(`Missing required EXIF field "${field}" in ${fileName}`);
  }

  return value;
};

const resolveCapturedAtUtc = (
  localDate: string,
  offset: string | null,
  timezone: string | null,
): string => {
  const localTimestamp = Date.parse(`${localDate}Z`);

  if (Number.isNaN(localTimestamp)) {
    throw new Error(`Invalid EXIF capture date: ${localDate}`);
  }

  // An explicit camera offset takes precedence.
  if (offset !== null) {
    if (!/^[+-](?:0\d|1[0-4]):[0-5]\d$/.test(offset)) {
      throw new Error(`Invalid EXIF timezone offset: ${offset}`);
    }

    return new Date(`${localDate}${offset}`).toISOString();
  }

  if (timezone === null) {
    throw new Error(
      `Cannot resolve UTC capture time without an offset or timezone: ${localDate}`,
    );
  }

  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const formatLocal = (timestamp: number): string => {
    const parts = formatter.formatToParts(new Date(timestamp));
    const values = Object.fromEntries(
      parts.map(({ type, value }) => [type, value]),
    );

    return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}:${values.second}`;
  };

  const candidateOffsets = new Set<number>();

  for (const shift of [-86_400_000, 0, 86_400_000]) {
    const timestamp = localTimestamp + shift;
    const representedLocal = Date.parse(`${formatLocal(timestamp)}Z`);

    candidateOffsets.add(representedLocal - timestamp);
  }

  const matches = [...candidateOffsets]
    .map((candidateOffset) => localTimestamp - candidateOffset)
    .filter((timestamp) => formatLocal(timestamp) === localDate);

  if (matches.length !== 1) {
    throw new Error(
      `Ambiguous or nonexistent local capture time: ${localDate} (${timezone})`,
    );
  }

  return new Date(matches[0]).toISOString();
};

export const createDraftPhotoMetadata = (
  sourceFileName: string,
  exif: ExtractedPhotoExif,
  resolvedLocation: PhotoResolvedLocationAuthored | null,
): PhotoAssetAuthored => {
  const id = toPhotoId(parse(sourceFileName).name);

  if (!id) {
    throw new Error(`Cannot derive photo ID from ${sourceFileName}`);
  }

  if (!exif.capturedAt) {
    throw new Error(`Missing EXIF capture date in ${sourceFileName}`);
  }

  const timezone = resolvePhotoTimezone(exif.latitude, exif.longitude);

  const captureYear = exif.capturedAt.slice(0, 4);

  return {
    id,
    sourceFileName,

    cloudflareImageId: null,
    cloudflareUploadedAt: null,

    title: toTitleFromFileName(sourceFileName),
    alt: REQUIRED_PLACEHOLDER,
    commentary: REQUIRED_PLACEHOLDER,
    readableLocation: resolvedLocation?.displayName ?? REQUIRED_PLACEHOLDER,

    capturedAt: {
      utc: resolveCapturedAtUtc(
        exif.capturedAt,
        exif.capturedAtOffset,
        timezone,
      ),
      timezone,
    },

    photographer: exif.photographer ?? personConfigAuthored.name,
    copyright: `© ${captureYear} ${personConfigAuthored.name}`,

    cameraMake: exif.cameraMake ?? REQUIRED_PLACEHOLDER,
    cameraModel: exif.cameraModel ?? REQUIRED_PLACEHOLDER,
    lensModel: exif.lensModel,

    exposureTime: requiredNumber(
      exif.exposureTime,
      "ExposureTime",
      sourceFileName,
    ),
    aperture: requiredNumber(exif.aperture, "FNumber", sourceFileName),
    iso: requiredNumber(exif.iso, "ISO", sourceFileName),

    focalLength: requiredNumber(
      exif.focalLength,
      "FocalLength",
      sourceFileName,
    ),
    focalLength35mm: exif.focalLength35mm,

    width: exif.width,
    height: exif.height,

    latitude: exif.latitude,
    longitude: exif.longitude,

    resolvedLocation,
  };
};
