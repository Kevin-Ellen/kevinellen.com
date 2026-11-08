// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/photo-sequence/photo-sequence.module.body.page.document.content.resolver.app-render-context.ts

import type { PhotoSequenceModuleContentAppResolve } from "../../../../../../../../types/document/page/content/modules/photo-sequence/photo-sequence.module.content.page.document.app-resolve.type";
import type { PhotoSequenceModuleContentAppRenderContext } from "../../../../../../../../types/document/page/content/modules/photo-sequence/photo-sequence.module.content.page.document.app-render-context.type";

import { resolvePhotoComponentContentAppRenderContext } from "../../components/photo/photo.component.body.page.document.content.resolver.app-render-context";

type Input = Readonly<{
  content: PhotoSequenceModuleContentAppResolve;
}>;

export const resolvePhotoSequenceModuleAppRenderContext = ({
  content,
}: Input): PhotoSequenceModuleContentAppRenderContext => ({
  ...content,
  photos: content.photos.map((photo) =>
    resolvePhotoComponentContentAppRenderContext({
      content: photo,
    }),
  ),
});
