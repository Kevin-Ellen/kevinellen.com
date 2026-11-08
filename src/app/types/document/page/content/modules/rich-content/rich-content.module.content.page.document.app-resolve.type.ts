// src/app/types/document/page/content/modules/rich-content/rich-content.module.content.page.document.app-resolve.type.ts

import type { RichContentModuleContentAppInit } from "../../../../../../../shared/types/content/modules/rich-content.module.content.shared.app-init.type";
import type { ComponentContentAppResolve } from "../../components/component.content.page.document.app-resolve.type";
import type { OmitAndReplace } from "../../../../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type RichContentModuleContentAppResolve = OmitAndReplace<
  RichContentModuleContentAppInit,
  Readonly<{
    components: readonly ComponentContentAppResolve[];
  }>
>;
