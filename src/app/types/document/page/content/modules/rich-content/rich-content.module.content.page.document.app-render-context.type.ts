// src/app/types/document/page/content/modules/rich-content/rich-content.module.content.page.document.app-render-context.type.ts

import type { RichContentModuleContentAppResolve } from "./rich-content.module.content.page.document.app-resolve.type";
import type { ComponentContentAppRenderContext } from "../../components/component.content.page.document.app-render-context.type";
import type { OmitAndReplace } from "../../../../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type RichContentModuleContentAppRenderContext = OmitAndReplace<
  RichContentModuleContentAppResolve,
  Readonly<{
    components: readonly ComponentContentAppRenderContext[];
  }>
>;
