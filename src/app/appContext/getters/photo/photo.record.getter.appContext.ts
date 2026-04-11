// src/app/appContext/getters/photo/photo.record.getter.appContext.ts

import type { AppContextPhotoId } from "@app/appContext/appContext.types";
import type {
  PhotoKvRecord,
  PhotoRecord,
} from "@shared-types/photo/record.photo.types";

export const getPhotoRecordByIds = async (
  env: Env,
  photoIds: readonly AppContextPhotoId[],
): Promise<readonly PhotoRecord[]> => {
  const uniqueIds = [...new Set(photoIds)];

  return Promise.all(
    uniqueIds.map(async (photoId) => {
      const photo = await env.KV_PHOTOS.get(`photo:${photoId}`, "json");

      if (!photo) {
        throw new Error(`Photo "${photoId}" could not be resolved.`);
      }

      const kvPhoto = photo as PhotoKvRecord;

      return {
        ...kvPhoto,
      };
    }),
  );
};
