// src/app/appContext/resolvers/photo/resolve.photo.appContext.ts

import type {
  AppContextPhoto,
  AppContextPhotoVariant,
} from "@app/appContext/appContext.types";
import type { PhotoRecord } from "@shared-types/photo/record.photo.types";

import { getPhotoRecordByIds } from "@app/appContext/getters/photo/photo.record.getter.appContext";

const resolvePhotoVariantUrl = (
  imageId: string,
  variant: AppContextPhotoVariant,
): string => {
  return `/photo/${imageId}/${variant}`;
};

const mapPhotoRecordToAppContextPhoto = (
  photo: PhotoRecord,
): AppContextPhoto => {
  return {
    id: photo.id,
    title: photo.title,
    alt: photo.alt,
    commentary: photo.commentary,
    readableLocation: photo.readableLocation,
    capturedAt: photo.capturedAt,
    cameraModel: photo.cameraModel,
    lensModel: photo.lensModel,
    exposureTime: photo.exposureTime,
    aperture: photo.aperture,
    iso: photo.iso,
    focalLength: photo.focalLength,
    intrinsic: {
      width: photo.width,
      height: photo.height,
    },
    image: {
      id: photo.image.id,
      uploadedAt: photo.image.uploadedAt,
      urls: {
        frame: resolvePhotoVariantUrl(photo.image.id, "frame"),
        content: resolvePhotoVariantUrl(photo.image.id, "content"),
      },
    },
  };
};

export const resolvePhotosAppContext = async (
  env: Env,
  ids: readonly string[],
): Promise<readonly AppContextPhoto[]> => {
  if (ids.length === 0) {
    return [];
  }

  const photos = await getPhotoRecordByIds(env, ids);

  return photos.map(mapPhotoRecordToAppContextPhoto);
};
