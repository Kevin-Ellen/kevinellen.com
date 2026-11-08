// src/app/life-cycle/app-resolve/resolvers/primitives/photo-metadata/photo-metadata.primitive.resolver.app-resolve.ts

import type { PhotoAppResolve } from "../../../../../types/photo/photo.app-resolve.type";
import type { PhotoGetter } from "../../../getters/photo-kv/photo-kv.getter.app-resolve";

const DEFAULT_MAX_WIDTH = 1400;

type Input = Readonly<{
  photoId: string;
  getPhoto: PhotoGetter;
}>;

export const resolvePhotoMetadataAppResolve = async ({
  photoId,
  getPhoto,
}: Input): Promise<PhotoAppResolve> => {
  const photo = await getPhoto(photoId);

  if (!photo) {
    throw new Error(`Unable to resolve photo: ${photoId}`);
  }

  const width = Math.min(photo.width, DEFAULT_MAX_WIDTH);
  const height = Math.round((photo.height / photo.width) * width);

  return {
    ...photo,
    dimensions: {
      width,
      height,
    },
  };
};
