// src/app/types/document/page/content/modules/photo-pair/photo-pair.module.content.page.document.app-render-context.type.ts

import type { PhotoPairModuleContentAppResolve } from "./photo-pair.module.content.page.document.app-resolve.type";
import type { PhotoComponentContentAppRenderContext } from "../../components/photo/photo.component.content.page.document.app-render-context.type";
import type { OmitAndReplace } from "../../../../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type PhotoPairModuleContentAppRenderContext = OmitAndReplace<
  PhotoPairModuleContentAppResolve,
  Readonly<{
    photos: readonly [
      PhotoComponentContentAppRenderContext,
      PhotoComponentContentAppRenderContext,
    ];
  }>
>;
