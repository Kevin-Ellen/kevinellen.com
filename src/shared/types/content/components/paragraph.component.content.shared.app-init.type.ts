// src/shared/types/content/components/paragraph.component.content.shared.app-init.type.ts

import type { ParagraphComponentContentAuthored } from "../../../../content-schema/content/components/paragraph.component.content.content-schema.authored.type";
import type { InlineContentAppInit } from "../inline/inline.content.shared.app-init.type";
import type { OmitAndReplace } from "../../utilities/omit-replace.utility.shared.type";

export type ParagraphComponentContentAppInit = OmitAndReplace<
  ParagraphComponentContentAuthored,
  {
    content: readonly InlineContentAppInit[];
  }
>;
