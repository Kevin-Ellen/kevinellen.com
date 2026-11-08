// src/app/types/document/page/content/modules/editorial-feature/editorial-feature.module.content.page.document.app-render-context.type.ts

import type { EditorialFeatureModuleContentAppResolve } from "./editorial-feature.module.content.page.document.app-resolve.type";
import type { ComponentContentAppRenderContext } from "../../components/component.content.page.document.app-render-context.type";
import type { EditorialPhotoComponentContentAppRenderContext } from "../../components/editorial-photo/editorial-photo.component.content.page.document.app-render-context.type";
import type { OmitAndReplace } from "../../../../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type EditorialFeatureModuleContentAppRenderContext = OmitAndReplace<
  EditorialFeatureModuleContentAppResolve,
  {
    components: readonly ComponentContentAppRenderContext[];
    media: EditorialPhotoComponentContentAppRenderContext;
  }
>;
