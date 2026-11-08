// src/app/types/document/page/content/modules/photo-sequence/photo-sequence.module.content.page.document.app-render-context.type.ts

import type { PhotoSequenceModuleContentAppResolve } from "./photo-sequence.module.content.page.document.app-resolve.type";
import type { PhotoComponentContentAppRenderContext } from "../../components/photo/photo.component.content.page.document.app-render-context.type";

export type PhotoSequenceModuleContentAppRenderContext = Omit<
  PhotoSequenceModuleContentAppResolve,
  "photos"
> & {
  photos: readonly PhotoComponentContentAppRenderContext[];
};
