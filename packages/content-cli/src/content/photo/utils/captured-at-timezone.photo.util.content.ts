// packages/content-cli/src/content/photo/utils/captured-at-timezone.photo.util.content.ts

import tzLookup from "tz-lookup";

import type { AuthoredPhotoMetadata } from "@shared-types/media/photo/authored.photo.types";

export const enrichPhotoCapturedAtTimezone = (
  photo: AuthoredPhotoMetadata,
): AuthoredPhotoMetadata => {
  if (!photo.capturedAt) {
    return photo;
  }

  if (photo.capturedAt.timezone) {
    return photo;
  }

  if (photo.latitude === null || photo.longitude === null) {
    return {
      ...photo,
      capturedAt: {
        ...photo.capturedAt,
        timezone: null,
      },
    };
  }

  return {
    ...photo,
    capturedAt: {
      ...photo.capturedAt,
      timezone: tzLookup(photo.latitude, photo.longitude),
    },
  };
};
