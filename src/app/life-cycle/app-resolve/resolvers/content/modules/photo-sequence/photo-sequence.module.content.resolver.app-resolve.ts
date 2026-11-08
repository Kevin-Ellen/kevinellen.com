// src/app/life-cycle/app-resolve/resolvers/content/modules/photo-sequence/photo-sequence.module.content.resolver.app-resolve.ts

import type { PhotoSequenceModuleContentAppInit } from "../../../../../../../shared/types/content/modules/photo-squence.module.content.shared.app-int.type";
import type { PhotoSequenceModuleContentAppResolve } from "../../../../../../types/document/page/content/modules/photo-sequence/photo-sequence.module.content.page.document.app-resolve.type";
import type { PhotoGetter } from "../../../../getters/photo-kv/photo-kv.getter.app-resolve";

import { resolvePhotoComponentContentAppResolve } from "../../components/photo/photo.component.content.resolver.app-resolve";

type Input = Readonly<{
  content: PhotoSequenceModuleContentAppInit;
  getPhoto: PhotoGetter;
}>;

export const resolvePhotoSequenceModuleAppResolve = async ({
  content,
  getPhoto,
}: Input): Promise<PhotoSequenceModuleContentAppResolve> => ({
  ...content,
  photos: await Promise.all(
    content.photos.map((photo) =>
      resolvePhotoComponentContentAppResolve({
        content: photo,
        getPhoto,
      }),
    ),
  ),
});
