// src/app/life-cycle/app-resolve/resolvers/content/modules/photo-pair/photo-pair.module.content.resolver.app-resolver.ts

import type { PhotoPairModuleContentAppInit } from "../../../../../../../shared/types/content/modules/photo-pair.module.content.shared.app-init.type";
import type { PhotoPairModuleContentAppResolve } from "../../../../../../types/document/page/content/modules/photo-pair/photo-pair.module.content.page.document.app-resolve.type";
import type { PhotoGetter } from "../../../../getters/photo-kv/photo-kv.getter.app-resolve";

import { resolvePhotoComponentContentAppResolve } from "../../components/photo/photo.component.content.resolver.app-resolve";

type Input = Readonly<{
  content: PhotoPairModuleContentAppInit;
  getPhoto: PhotoGetter;
}>;

export const resolvePhotoPairModuleContentAppResolve = async ({
  content,
  getPhoto,
}: Input): Promise<PhotoPairModuleContentAppResolve> => {
  const [first, second] = await Promise.all([
    resolvePhotoComponentContentAppResolve({
      content: content.photos[0],
      getPhoto,
    }),
    resolvePhotoComponentContentAppResolve({
      content: content.photos[1],
      getPhoto,
    }),
  ]);

  return {
    ...content,
    photos: [first, second],
  };
};
