// src/app/types/document/page/content/modules/editorial-split/editorial-split.module.content.page.document.app-resolve.type.ts

import type { EditorialSplitModuleContentAppInit } from "../../../../../../../shared/types/content/modules/editorial-split.module.content.shared.app-init.type";
import type { ComponentContentAppResolve } from "../../components/component.content.page.document.app-resolve.type";

import type { OmitAndReplace } from "../../../../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type EditorialSplitModuleContentAppResolve = OmitAndReplace<
  EditorialSplitModuleContentAppInit,
  {
    components: readonly ComponentContentAppResolve[];
    media: Extract<
      ComponentContentAppResolve,
      { kind: "editorialPhoto" | "richList" }
    >;
  }
>;
