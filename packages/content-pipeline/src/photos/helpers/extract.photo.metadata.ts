// packages/content-pipeline/src/photos/helpers/extract.photo.metadata.ts

import fs from "node:fs/promises";

import exifr from "exifr";
import sharp from "sharp";

type ExtractedPhotoMetadata = {
  capturedAt: string | null;

  photographer: string | null;
  copyright: string | null;

  cameraMake: string | null;
  cameraModel: string | null;
  lensModel: string | null;

  exposureTime: number | null;
  aperture: number | null;
  iso: number | null;

  focalLength: number | null;
  focalLength35mm: number | null;

  meteringMode: string | null;
  exposureMode: string | null;
  whiteBalance: string | null;

  width: number | null;
  height: number | null;

  latitude: number | null;
  longitude: number | null;
};

const pad = (n: number): string => String(n).padStart(2, "0");

/**
 * Converts Date → local ISO WITHOUT timezone conversion
 * Example: "2025-05-27T09:50:57"
 */
const toLocalISOString = (value: unknown): string | null => {
  if (!(value instanceof Date)) return null;

  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}T${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`;
};

const toNumberOrNull = (value: unknown): number | null => {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
};

const toStringOrNull = (value: unknown): string | null => {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
};

const toPhotographerOrNull = (
  exifData: Record<string, unknown> | null,
): string | null => {
  if (!exifData) return null;

  return (
    toStringOrNull(exifData.Artist) ??
    toStringOrNull(exifData.Creator) ??
    toStringOrNull(exifData.OwnerName)
  );
};

export const extractPhotoMetadata = async (
  imageFilePath: string,
): Promise<ExtractedPhotoMetadata> => {
  const imageBuffer = await fs.readFile(imageFilePath);

  const [exifData, sharpMetadata] = await Promise.all([
    exifr.parse(imageBuffer, { gps: true }),
    sharp(imageBuffer).metadata(),
  ]);

  const exifRecord =
    exifData && typeof exifData === "object" && !Array.isArray(exifData)
      ? (exifData as Record<string, unknown>)
      : null;

  const capturedAtSource =
    exifRecord?.DateTimeOriginal ?? exifRecord?.CreateDate;

  return {
    // ✅ LOCAL TIME (no UTC conversion)
    capturedAt: toLocalISOString(capturedAtSource),

    photographer: toPhotographerOrNull(exifRecord),
    copyright: toStringOrNull(exifRecord?.Copyright),

    cameraMake: toStringOrNull(exifRecord?.Make),
    cameraModel: toStringOrNull(exifRecord?.Model),
    lensModel: toStringOrNull(exifRecord?.LensModel),

    exposureTime: toNumberOrNull(exifRecord?.ExposureTime),
    aperture: toNumberOrNull(exifRecord?.FNumber),
    iso:
      toNumberOrNull(exifRecord?.ISO) ??
      toNumberOrNull(exifRecord?.RecommendedExposureIndex),

    focalLength: toNumberOrNull(exifRecord?.FocalLength),
    focalLength35mm: toNumberOrNull(exifRecord?.FocalLengthIn35mmFormat),

    meteringMode: toStringOrNull(exifRecord?.MeteringMode),
    exposureMode: toStringOrNull(exifRecord?.ExposureMode),
    whiteBalance: toStringOrNull(exifRecord?.WhiteBalance),

    width: typeof sharpMetadata.width === "number" ? sharpMetadata.width : null,
    height:
      typeof sharpMetadata.height === "number" ? sharpMetadata.height : null,

    latitude: toNumberOrNull(exifRecord?.latitude),
    longitude: toNumberOrNull(exifRecord?.longitude),
  };
};
