// src/app/types/document/page/content/modules/editorial-feature/editorial-feature.module.content.page.document.app-resolve.type.ts

import type { EditorialFeatureModuleContentAppInit } from "../../../../../../../shared/types/content/modules/editorial-feature.module.content.shared.app-init.type";
import type { ComponentContentAppResolve } from "../../components/component.content.page.document.app-resolve.type";
import type { EditorialPhotoComponentContentAppResolve } from "../../components/editorial-photo/editorial-photo.component.content.page.document.app-resolve.type";
import type { OmitAndReplace } from "../../../../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type EditorialFeatureModuleContentAppResolve = OmitAndReplace<
  EditorialFeatureModuleContentAppInit,
  {
    components: readonly ComponentContentAppResolve[];
    media: EditorialPhotoComponentContentAppResolve;
  }
>;
