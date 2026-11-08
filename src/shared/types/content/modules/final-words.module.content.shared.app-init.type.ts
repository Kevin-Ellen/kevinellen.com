// src/shared/types/content/modules/final-words.module.content.shared.app-init.type.ts

import type { FinalWordsModuleContentAuthored } from "../../../../content-schema/content/modules/final-words.module.content.content-schema.authored.type";
import type { ComponentContentAppInit } from "../components/component.content.shared.app-init.type";
import type { OmitAndReplace } from "../../utilities/omit-replace.utility.shared.type";

export type FinalWordsModuleContentAppInit = OmitAndReplace<
  FinalWordsModuleContentAuthored,
  {
    components: readonly ComponentContentAppInit[];
  }
>;
