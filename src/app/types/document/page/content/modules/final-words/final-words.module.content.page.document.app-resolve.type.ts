// src/app/types/document/page/content/modules/final-words/final-words.module.content.page.document.app-resolve.type.ts

import type { FinalWordsModuleContentAppInit } from "../../../../../../../shared/types/content/modules/final-words.module.content.shared.app-init.type";
import type { ComponentContentAppResolve } from "../../components/component.content.page.document.app-resolve.type";

export type FinalWordsModuleContentAppResolve = Readonly<
  Omit<FinalWordsModuleContentAppInit, "components"> & {
    components: readonly ComponentContentAppResolve[];
  }
>;
