// packages/content-pipeline/src/photos/helpers/normalise.photo.draft.helper.ts

import type { PhotoDraftEntry } from "@content-pipeline/photos/types/photo.draft.entry.types";
import type { PhotoEntry } from "@content-pipeline/photos/types/photo.entry.types";

const REQUIRED_PLACEHOLDER = "__REQUIRED__";

const toSlug = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const getRequiredString = (
  value: string,
  fieldName: keyof Pick<
    PhotoDraftEntry,
    "alt" | "commentary" | "readableLocation" | "title"
  >,
  photoId: string,
): string => {
  if (value.trim().length === 0 || value === REQUIRED_PLACEHOLDER) {
    throw new Error(
      `Photo draft "${photoId}" is missing required field: ${fieldName}`,
    );
  }

  return value;
};

export const normalisePhotoDraft = (photo: PhotoDraftEntry): PhotoEntry => {
  return {
    id: photo.id,
    slug: toSlug(photo.id),

    title: getRequiredString(photo.title, "title", photo.id),
    alt: getRequiredString(photo.alt, "alt", photo.id),
    commentary: getRequiredString(photo.commentary, "commentary", photo.id),
    readableLocation: getRequiredString(
      photo.readableLocation,
      "readableLocation",
      photo.id,
    ),

    capturedAt: photo.capturedAt,

    photographer: photo.photographer,
    copyright: photo.copyright,

    cameraMake: photo.cameraMake,
    cameraModel: photo.cameraModel,
    lensModel: photo.lensModel,

    exposureTime: photo.exposureTime,
    aperture: photo.aperture,
    iso: photo.iso,

    focalLength: photo.focalLength,
    focalLength35mm: photo.focalLength35mm,

    meteringMode: photo.meteringMode,
    exposureMode: photo.exposureMode,
    whiteBalance: photo.whiteBalance,

    width: photo.width,
    height: photo.height,

    latitude: photo.latitude,
    longitude: photo.longitude,

    locationResolved: photo.locationResolved,
  };
};
