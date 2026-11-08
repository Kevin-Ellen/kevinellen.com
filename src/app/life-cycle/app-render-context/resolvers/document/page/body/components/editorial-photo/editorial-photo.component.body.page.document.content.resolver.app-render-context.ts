// src/app/life-cycle/app-render-context/resolvers/document/page/body/components/editorial-photo/editorial-photo.component.body.page.document.content.resolver.app-render-context.ts

import type { EditorialPhotoComponentContentAppResolve } from "../../../../../../../../types/document/page/content/components/editorial-photo/editorial-photo.component.content.page.document.app-resolve.type";
import type { EditorialPhotoComponentContentAppRenderContext } from "../../../../../../../../types/document/page/content/components/editorial-photo/editorial-photo.component.content.page.document.app-render-context.type";

type Input = Readonly<{
  content: EditorialPhotoComponentContentAppResolve;
}>;

export const resolveEditorialPhotoComponentContentAppRenderContext = ({
  content,
}: Input): EditorialPhotoComponentContentAppRenderContext => ({
  ...content,
});
