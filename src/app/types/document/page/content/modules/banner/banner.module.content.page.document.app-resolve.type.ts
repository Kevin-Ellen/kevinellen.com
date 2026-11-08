// src/app/types/document/page/content/modules/banner/banner.module.content.page.document.app-resolve.type.ts

import type { BannerModuleContentAppInit } from "../../../../../../../shared/types/content/modules/banner.module.content.shared.app-init.type";
import type { ComponentContentAppResolve } from "../../components/component.content.page.document.app-resolve.type";
import type { EditorialPhotoComponentContentAppResolve } from "../../components/editorial-photo/editorial-photo.component.content.page.document.app-resolve.type";
import type { OmitAndReplace } from "../../../../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type BannerModuleContentAppResolve = OmitAndReplace<
  BannerModuleContentAppInit,
  {
    media: EditorialPhotoComponentContentAppResolve;
    components: readonly ComponentContentAppResolve[];
  }
>;
