// packages/content-pipeline/src/photos/helpers/render.photo.draft.file.ts

import type { PhotoDraftEntry } from "@content-pipeline/photos/types/photo.draft.entry.types";

const renderString = (value: string): string => JSON.stringify(value);

const renderNullableString = (value: string | null): string =>
  value === null ? "null" : JSON.stringify(value);

const renderNullableNumber = (value: number | null): string =>
  value === null ? "null" : String(value);

const renderLocationResolved = (
  value: PhotoDraftEntry["locationResolved"],
): string => {
  if (value === null) {
    return "null";
  }

  return `{
    name: ${renderNullableString(value.name)},
    road: ${renderNullableString(value.road)},
    village: ${renderNullableString(value.village)},
    town: ${renderNullableString(value.town)},
    city: ${renderNullableString(value.city)},
    county: ${renderNullableString(value.county)},
    state: ${renderNullableString(value.state)},
    country: ${renderNullableString(value.country)},
    countryCode: ${renderNullableString(value.countryCode)},
    postcode: ${renderNullableString(value.postcode)},
    displayName: ${renderNullableString(value.displayName)},
  }`;
};

export const renderPhotoDraftFile = (
  photoDraftEntry: PhotoDraftEntry,
): string => {
  return `import type { PhotoDraftEntry } from "@content-pipeline/photos/types/photo.draft.entry.types";

export const photo = {
  id: ${renderString(photoDraftEntry.id)},
  sourceFileName: ${renderString(photoDraftEntry.sourceFileName)},

  title: ${renderString(photoDraftEntry.title)},
  alt: ${renderString(photoDraftEntry.alt)},
  commentary: ${renderString(photoDraftEntry.commentary)},
  readableLocation: ${renderString(photoDraftEntry.readableLocation)},

  capturedAt: ${renderNullableString(photoDraftEntry.capturedAt)},

  photographer: ${renderNullableString(photoDraftEntry.photographer)},
  copyright: ${renderNullableString(photoDraftEntry.copyright)},

  cameraMake: ${renderNullableString(photoDraftEntry.cameraMake)},
  cameraModel: ${renderNullableString(photoDraftEntry.cameraModel)},
  lensModel: ${renderNullableString(photoDraftEntry.lensModel)},

  exposureTime: ${renderNullableNumber(photoDraftEntry.exposureTime)},
  aperture: ${renderNullableNumber(photoDraftEntry.aperture)},
  iso: ${renderNullableNumber(photoDraftEntry.iso)},

  focalLength: ${renderNullableNumber(photoDraftEntry.focalLength)},
  focalLength35mm: ${renderNullableNumber(photoDraftEntry.focalLength35mm)},

  meteringMode: ${renderNullableString(photoDraftEntry.meteringMode)},
  exposureMode: ${renderNullableString(photoDraftEntry.exposureMode)},
  whiteBalance: ${renderNullableString(photoDraftEntry.whiteBalance)},

  width: ${renderNullableNumber(photoDraftEntry.width)},
  height: ${renderNullableNumber(photoDraftEntry.height)},

  latitude: ${renderNullableNumber(photoDraftEntry.latitude)},
  longitude: ${renderNullableNumber(photoDraftEntry.longitude)},

  locationResolved: ${renderLocationResolved(photoDraftEntry.locationResolved)},

} satisfies PhotoDraftEntry;
`;
};
