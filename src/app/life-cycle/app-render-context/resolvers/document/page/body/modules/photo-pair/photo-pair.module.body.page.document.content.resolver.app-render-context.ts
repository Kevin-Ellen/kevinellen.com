// src/app/life-cycle/app-render-context/resolvers/document/page/body/modules/photo-pair/photo-pair.module.body.page.document.content.resolver.app-render-context.ts

import type { PhotoPairModuleContentAppResolve } from "../../../../../../../../types/document/page/content/modules/photo-pair/photo-pair.module.content.page.document.app-resolve.type";
import type { PhotoPairModuleContentAppRenderContext } from "../../../../../../../../types/document/page/content/modules/photo-pair/photo-pair.module.content.page.document.app-render-context.type";

import { resolvePhotoComponentContentAppRenderContext } from "../../components/photo/photo.component.body.page.document.content.resolver.app-render-context";

type Input = Readonly<{
  content: PhotoPairModuleContentAppResolve;
}>;

export const resolvePhotoPairModuleContentAppRenderContext = ({
  content,
}: Input): PhotoPairModuleContentAppRenderContext => ({
  ...content,
  photos: [
    resolvePhotoComponentContentAppRenderContext({
      content: content.photos[0],
    }),
    resolvePhotoComponentContentAppRenderContext({
      content: content.photos[1],
    }),
  ],
});
