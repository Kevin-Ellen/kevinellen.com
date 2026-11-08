// src/app/types/document/page/content/components/photo/photo.component.content.page.document.app-render-context.type.ts

import type { PhotoComponentContentAppResolve } from "./photo.component.content.page.document.app-resolve.type";
import type { PhotoAppRenderContext } from "../../../../../photo/photo.app-render-context.type";
import type { OmitAndReplace } from "../../../../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type PhotoComponentContentAppRenderContext = OmitAndReplace<
  Omit<PhotoComponentContentAppResolve, "photoId">,
  Readonly<{
    photo: PhotoAppRenderContext;
  }>
>;
