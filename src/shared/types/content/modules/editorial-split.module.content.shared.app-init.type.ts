// src/shared/types/content/modules/editorial-split.module.content.shared.app-init.type.ts

import type { EditorialSplitModuleContentAuthored } from "../../../../content-schema/content/modules/editorial-split.module.content.content-schema.authored.type";
import type { ComponentContentAppInit } from "../components/component.content.shared.app-init.type";
import type { OmitAndReplace } from "../../utilities/omit-replace.utility.shared.type";

export type EditorialSplitModuleContentAppInit = OmitAndReplace<
  EditorialSplitModuleContentAuthored,
  {
    components: readonly ComponentContentAppInit[];
    media: Extract<
      ComponentContentAppInit,
      { kind: "editorialPhoto" | "richList" }
    >;
  }
>;
