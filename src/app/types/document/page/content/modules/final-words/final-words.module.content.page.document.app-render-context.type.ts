// src/app/types/document/page/content/modules/final-words/final-words.module.content.page.document.app-render-context.type.ts

import type { FinalWordsModuleContentAppResolve } from "./final-words.module.content.page.document.app-resolve.type";
import type { ComponentContentAppRenderContext } from "../../components/component.content.page.document.app-render-context.type";

export type FinalWordsModuleContentAppRenderContext = Readonly<
  Omit<FinalWordsModuleContentAppResolve, "components"> & {
    components: readonly ComponentContentAppRenderContext[];
  }
>;
