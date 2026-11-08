// src/app/life-cycle/app-resolve/resolvers/content/modules/featured-photo/featured-photo.module.content.resolver.app-resolve.ts

import type { FeaturedPhotoModuleContentAppInit } from "../../../../../../../shared/types/content/modules/featured-photo.module.content.shared.app-int.type";
import type { FeaturedPhotoModuleContentAppResolve } from "../../../../../../types/document/page/content/modules/featured-photo/featured-photo.module.content.page.document.app-resolve.type";
import type { PhotoGetter } from "../../../../getters/photo-kv/photo-kv.getter.app-resolve";

import { resolvePhotoMetadataAppResolve } from "../../../primitives/photo-metadata/photo-metadata.primitive.resolver.app-resolve";

type Input = Readonly<{
  content: FeaturedPhotoModuleContentAppInit;
  getPhoto: PhotoGetter;
}>;

export const resolveFeaturedPhotoModuleContentAppResolve = async ({
  content,
  getPhoto,
}: Input): Promise<FeaturedPhotoModuleContentAppResolve> => {
  const photo = await resolvePhotoMetadataAppResolve({
    photoId: content.photoId,
    getPhoto,
  });

  return {
    ...content,
    photo,
    alt: content.alt ?? photo.alt,
    commentary: content.commentary ?? photo.commentary,
  };
};
