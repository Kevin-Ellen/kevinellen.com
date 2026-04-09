// src/app/appContext/resolvers/photo/resolve.photo.appContext.ts

import type {
  AppContextPhoto,
  PhotoVariant,
} from "@app/appContext/appContext.types";
import type { PublicPage } from "@shared-types/content/pages/public/public.page.union";
import type { ErrorPage } from "@shared-types/content/pages/error/error.page.union";
import type { PhotoRecord } from "@shared-types/photo/record.photo.type";

import { extractPhotoIdsAppContext } from "@app/appContext/resolvers/photo/extract.Ids.photo.appContext";
import { getPhotoRecordByIds } from "@app/appContext/getters/photo/photo.record.getter.appContext";

const resolvePhotoVariantUrl = (
  imageId: string,
  variant: PhotoVariant,
): string => {
  return `/photo/${imageId}.${variant}`;
};

const mapPhotoRecordToAppContextPhoto = (
  photo: PhotoRecord,
): AppContextPhoto => {
  const variants: readonly PhotoVariant[] = photo.image.variants;

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
      filename: photo.image.filename,
      uploadedAt: photo.image.uploadedAt,
      variants,
      urls: {
        frame: resolvePhotoVariantUrl(photo.image.id, "frame"),
        content: resolvePhotoVariantUrl(photo.image.id, "content"),
      },
    },
  };
};

export const resolvePhotosAppContext = async (
  env: Env,
  content: PublicPage | ErrorPage,
): Promise<readonly AppContextPhoto[]> => {
  const ids = extractPhotoIdsAppContext(content);

  if (ids.length === 0) {
    return [];
  }

  const photos = await getPhotoRecordByIds(env, ids);

  return photos.map(mapPhotoRecordToAppContextPhoto);
};
