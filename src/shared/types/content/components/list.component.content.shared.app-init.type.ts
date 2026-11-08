// src/shared/types/content/components/list.component.content.shared.app-init.type.ts

import type { ListComponentContentAuthored } from "../../../../content-schema/content/components/list.component.content.content-schema.authored.type";
import type { InlineContentAppInit } from "../inline/inline.content.shared.app-init.type";
import type { OmitAndReplace } from "../../utilities/omit-replace.utility.shared.type";

export type ListComponentContentAppInit = OmitAndReplace<
  ListComponentContentAuthored,
  {
    items: readonly Readonly<{
      content: readonly InlineContentAppInit[];
    }>[];
  }
>;
