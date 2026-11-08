// src/app/types/document/page/content/modules/photo-sequence/photo-sequence.module.content.page.document.app-resolve.type.ts

import type { PhotoSequenceModuleContentAppInit } from "../../../../../../../shared/types/content/modules/photo-squence.module.content.shared.app-int.type";
import type { PhotoComponentContentAppResolve } from "../../components/photo/photo.component.content.page.document.app-resolve.type";

export type PhotoSequenceModuleContentAppResolve = Omit<
  PhotoSequenceModuleContentAppInit,
  "photos"
> & {
  photos: readonly PhotoComponentContentAppResolve[];
};
