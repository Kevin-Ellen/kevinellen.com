// src/app/types/document/page/content/modules/editorial-split/editorial-split.module.content.page.document.app-render-context.type.ts

import type { EditorialSplitModuleContentAppResolve } from "./editorial-split.module.content.page.document.app-resolve.type";
import type { ComponentContentAppRenderContext } from "../../components/component.content.page.document.app-render-context.type";

import type { OmitAndReplace } from "../../../../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type EditorialSplitModuleContentAppRenderContext = OmitAndReplace<
  EditorialSplitModuleContentAppResolve,
  {
    components: readonly ComponentContentAppRenderContext[];
    media: Extract<
      ComponentContentAppRenderContext,
      { kind: "editorialPhoto" | "richList" }
    >;
  }
>;
