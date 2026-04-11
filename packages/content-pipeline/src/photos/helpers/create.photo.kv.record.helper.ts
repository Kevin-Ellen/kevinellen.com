// packages/content-pipeline/src/photos/helpers/create.photo.kv.record.helper.ts

import type { CloudflareImageUploadResult } from "@content-pipeline/media/types/cloudflare.images.types";
import type { PhotoEntry } from "@content-pipeline/photos/types/photo.entry.types";
import type { PhotoKvRecord } from "@content-pipeline/photos/types/photo.kv.record.types";

export const createPhotoKvRecord = (
  photoEntry: PhotoEntry,
  uploadedImage: CloudflareImageUploadResult,
): PhotoKvRecord => {
  return {
    id: photoEntry.id,

    title: photoEntry.title,
    alt: photoEntry.alt,
    commentary: photoEntry.commentary,

    readableLocation: photoEntry.readableLocation,
    capturedAt: photoEntry.capturedAt,

    photographer: photoEntry.photographer,
    copyright: photoEntry.copyright,

    cameraMake: photoEntry.cameraMake,
    cameraModel: photoEntry.cameraModel,
    lensModel: photoEntry.lensModel,

    exposureTime: photoEntry.exposureTime,
    aperture: photoEntry.aperture,
    iso: photoEntry.iso,

    focalLength: photoEntry.focalLength,
    focalLength35mm: photoEntry.focalLength35mm,

    width: photoEntry.width,
    height: photoEntry.height,

    latitude: photoEntry.latitude,
    longitude: photoEntry.longitude,

    locationResolved: photoEntry.locationResolved,

    image: {
      id: uploadedImage.id,
      uploadedAt: uploadedImage.uploaded,
    },
  };
};
