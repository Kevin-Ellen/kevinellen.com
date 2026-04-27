// packages/content-cli/src/content/photo/render.photo.content.ts

// packages/content-cli/src/content/photo/render.photo.content.ts

import type { AuthoredPhotoMetadata } from "@shared-types/media/photo/authored.photo.types";

const renderString = (value: string): string => JSON.stringify(value);

const renderNullableString = (value: string | null): string =>
  value === null ? "null" : JSON.stringify(value);

const renderNullableNumber = (value: number | null): string =>
  value === null ? "null" : String(value);

const renderResolvedLocation = (
  value: AuthoredPhotoMetadata["resolvedLocation"],
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

export const renderPhotoDraftFile = (photo: AuthoredPhotoMetadata): string => {
  return `import type { AuthoredPhotoMetadata } from "@shared-types/media/photo/authored.photo.types";

export const photo: AuthoredPhotoMetadata = {
  id: ${renderString(photo.id)},
  sourceFileName: ${renderString(photo.sourceFileName)},

  cloudflareImageId: ${renderNullableString(photo.cloudflareImageId)},
  cloudflareUploadedAt: ${renderNullableString(photo.cloudflareUploadedAt)},

  title: ${renderString(photo.title)},
  alt: ${renderString(photo.alt)},
  commentary: ${renderString(photo.commentary)},
  readableLocation: ${renderString(photo.readableLocation)},

  capturedAt: ${renderNullableString(photo.capturedAt)},

  photographer: ${renderNullableString(photo.photographer)},
  copyright: ${renderNullableString(photo.copyright)},

  cameraMake: ${renderNullableString(photo.cameraMake)},
  cameraModel: ${renderNullableString(photo.cameraModel)},
  lensModel: ${renderNullableString(photo.lensModel)},

  exposureTime: ${renderNullableNumber(photo.exposureTime)},
  aperture: ${renderNullableNumber(photo.aperture)},
  iso: ${renderNullableNumber(photo.iso)},

  focalLength: ${renderNullableNumber(photo.focalLength)},
  focalLength35mm: ${renderNullableNumber(photo.focalLength35mm)},

  width: ${String(photo.width)},
  height: ${String(photo.height)},

  latitude: ${renderNullableNumber(photo.latitude)},
  longitude: ${renderNullableNumber(photo.longitude)},

  resolvedLocation: ${renderResolvedLocation(photo.resolvedLocation)},

} satisfies AuthoredPhotoMetadata;
`;
};
