// packages/content-pipeline/src/photos/helpers/create.photo.draft.entry.helper.ts

import path from "node:path";

import type { ResolvedImageMetadata } from "@content-pipeline/media/types/resolved.image.metadata.types";
import type { PhotoDraftEntry } from "@content-pipeline/photos/types/photo.draft.entry.types";

const toId = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const toTitleFromFileName = (fileName: string): string => {
  return path
    .parse(fileName)
    .name.replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const createPhotoDraftEntry = (
  resolved: ResolvedImageMetadata,
): PhotoDraftEntry => {
  const id = toId(path.parse(resolved.sourceFileName).name);

  return {
    id,
    sourceFileName: resolved.sourceFileName,

    title: toTitleFromFileName(resolved.sourceFileName),
    alt: "__REQUIRED__",
    commentary: "__REQUIRED__",
    readableLocation: "__REQUIRED__",

    capturedAt: resolved.capturedAt,

    photographer: resolved.photographer,
    copyright: resolved.copyright,

    cameraMake: resolved.cameraMake,
    cameraModel: resolved.cameraModel,
    lensModel: resolved.lensModel,

    exposureTime: resolved.exposureTime,
    aperture: resolved.aperture,
    iso: resolved.iso,

    focalLength: resolved.focalLength,
    focalLength35mm: resolved.focalLength35mm,

    meteringMode: resolved.meteringMode,
    exposureMode: resolved.exposureMode,
    whiteBalance: resolved.whiteBalance,

    width: resolved.width,
    height: resolved.height,

    latitude: resolved.latitude,
    longitude: resolved.longitude,

    locationResolved: resolved.locationResolved,
  };
};
