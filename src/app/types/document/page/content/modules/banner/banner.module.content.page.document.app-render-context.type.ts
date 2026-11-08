// src/app/types/document/page/content/modules/banner/banner.module.content.page.document.app-render-context.type.ts

import type { BannerModuleContentAppResolve } from "./banner.module.content.page.document.app-resolve.type";
import type { ComponentContentAppRenderContext } from "../../components/component.content.page.document.app-render-context.type";
import type { EditorialPhotoComponentContentAppRenderContext } from "../../components/editorial-photo/editorial-photo.component.content.page.document.app-render-context.type";
import type { OmitAndReplace } from "../../../../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type BannerModuleContentAppRenderContext = OmitAndReplace<
  BannerModuleContentAppResolve,
  {
    media: EditorialPhotoComponentContentAppRenderContext;
    components: readonly ComponentContentAppRenderContext[];
  }
>;
