// packages/content-cli/src/content/photo/draft.create.photo.content.ts

import path from "node:path";

import type { AuthoredPhotoMetadata } from "@shared-types/media/photo/authored.photo.types";
import type { ExtractedPhotoExif } from "@content-cli/content/photo/utils/exif.photo.util.content";
import type { AuthoredResolvedLocation } from "@shared-types/media/photo/location.photo.types";

const REQUIRED_PLACEHOLDER = "__REQUIRED__";

const toId = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const toTitleFromFileName = (fileName: string): string =>
  path
    .parse(fileName)
    .name.replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const createDraftPhotoMetadata = (
  sourceFileName: string,
  exif: ExtractedPhotoExif,
  resolvedLocation: AuthoredResolvedLocation | null,
): AuthoredPhotoMetadata => ({
  id: toId(path.parse(sourceFileName).name),
  sourceFileName,

  cloudflareImageId: null,
  cloudflareUploadedAt: null,

  title: toTitleFromFileName(sourceFileName),
  alt: REQUIRED_PLACEHOLDER,
  commentary: REQUIRED_PLACEHOLDER,
  readableLocation: resolvedLocation?.displayName ?? REQUIRED_PLACEHOLDER,

  capturedAt: exif.capturedAt,

  photographer: exif.photographer,
  copyright: exif.copyright,

  cameraMake: exif.cameraMake,
  cameraModel: exif.cameraModel,
  lensModel: exif.lensModel,

  exposureTime: exif.exposureTime,
  aperture: exif.aperture,
  iso: exif.iso,

  focalLength: exif.focalLength,
  focalLength35mm: exif.focalLength35mm,

  width: exif.width,
  height: exif.height,

  latitude: exif.latitude,
  longitude: exif.longitude,

  resolvedLocation: resolvedLocation,
});
