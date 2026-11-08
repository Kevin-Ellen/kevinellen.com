// src/app/life-cycle/app-resolve/resolvers/content/components/photo/photo.component.content.resolver.app-resolve.ts

import type { PhotoComponentContentAppInit } from "../../../../../../../shared/types/content/components/photo.component.content.shared.app-init.type";
import type { PhotoComponentContentAppResolve } from "../../../../../../types/document/page/content/components/photo/photo.component.content.page.document.app-resolve.type";
import type { PhotoGetter } from "../../../../getters/photo-kv/photo-kv.getter.app-resolve";

import { resolvePhotoMetadataAppResolve } from "../../../primitives/photo-metadata/photo-metadata.primitive.resolver.app-resolve";

type Input = Readonly<{
  content: PhotoComponentContentAppInit;
  getPhoto: PhotoGetter;
}>;

export const resolvePhotoComponentContentAppResolve = async ({
  content,
  getPhoto,
}: Input): Promise<PhotoComponentContentAppResolve> => {
  const photo = await resolvePhotoMetadataAppResolve({
    photoId: content.photoId,
    getPhoto,
  });

  return {
    ...content,
    photo: {
      ...photo,
      alt: content.alt ?? photo.alt,
      commentary: content.commentary ?? photo.commentary,
    },
  };
};
