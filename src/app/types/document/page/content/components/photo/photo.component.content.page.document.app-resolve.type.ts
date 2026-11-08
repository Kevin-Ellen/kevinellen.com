// src/app/types/document/page/content/components/photo/photo.component.content.page.document.app-resolve.type.ts

import type { PhotoComponentContentAppInit } from "../../../../../../../shared/types/content/components/photo.component.content.shared.app-init.type";
import type { PhotoAppResolve } from "../../../../../photo/photo.app-resolve.type";
import type { OmitAndReplace } from "../../../../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type PhotoComponentContentAppResolve = OmitAndReplace<
  PhotoComponentContentAppInit,
  Readonly<{
    photo: PhotoAppResolve;
  }>
>;
