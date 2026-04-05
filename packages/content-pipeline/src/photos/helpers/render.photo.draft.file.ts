// packages/content-pipeline/src/photos/helpers/render.photo.draft.file.ts

import type { PhotoDraftEntry } from "@shared-types/photos/photo.draft.types";

const renderString = (value: string): string => JSON.stringify(value);

const renderNullableString = (value: string | null): string =>
  value === null ? "null" : JSON.stringify(value);

const renderNullableNumber = (value: number | null): string =>
  value === null ? "null" : String(value);

const indentBlock = (value: string, indent = 2): string => {
  const padding = " ".repeat(indent);

  return value
    .split("\n")
    .map((line) => `${padding}${line}`)
    .join("\n");
};

const renderNullableObject = (
  value: Record<string, unknown> | null,
  indent = 2,
): string => {
  if (value === null) {
    return "null";
  }

  return indentBlock(JSON.stringify(value, null, 2), indent);
};

export const renderPhotoDraftFile = (
  photoDraftEntry: PhotoDraftEntry,
): string => {
  return `export const photo = {
  // --- identity ---
  slug: ${renderString(photoDraftEntry.slug)},
  sourceFileName: ${renderString(photoDraftEntry.sourceFileName)},

  // --- editorial ---
  title: ${renderString(photoDraftEntry.title)},
  alt: ${renderString(photoDraftEntry.alt)},
  commentary: ${renderString(photoDraftEntry.commentary)},
  readableLocation: ${renderString(photoDraftEntry.readableLocation)},

  capturedAt: ${renderNullableString(photoDraftEntry.capturedAt)},

  // --- authorship ---
  photographer: ${renderNullableString(photoDraftEntry.photographer)},
  copyright: ${renderNullableString(photoDraftEntry.copyright)},

  // --- equipment ---
  cameraMake: ${renderNullableString(photoDraftEntry.cameraMake)},
  cameraModel: ${renderNullableString(photoDraftEntry.cameraModel)},
  lensModel: ${renderNullableString(photoDraftEntry.lensModel)},

  // --- exposure triangle ---
  exposureTime: ${renderNullableNumber(photoDraftEntry.exposureTime)},
  aperture: ${renderNullableNumber(photoDraftEntry.aperture)},
  iso: ${renderNullableNumber(photoDraftEntry.iso)},

  // --- optics ---
  focalLength: ${renderNullableNumber(photoDraftEntry.focalLength)},
  focalLength35mm: ${renderNullableNumber(photoDraftEntry.focalLength35mm)},

  // --- shooting context ---
  meteringMode: ${renderNullableString(photoDraftEntry.meteringMode)},
  exposureMode: ${renderNullableString(photoDraftEntry.exposureMode)},
  whiteBalance: ${renderNullableString(photoDraftEntry.whiteBalance)},

  // --- dimensions ---
  width: ${renderNullableNumber(photoDraftEntry.width)},
  height: ${renderNullableNumber(photoDraftEntry.height)},

  // --- location ---
  latitude: ${renderNullableNumber(photoDraftEntry.latitude)},
  longitude: ${renderNullableNumber(photoDraftEntry.longitude)},

  // --- derived ---
  locationResolved: ${renderNullableObject(photoDraftEntry.locationResolved)},
};
`;
};
