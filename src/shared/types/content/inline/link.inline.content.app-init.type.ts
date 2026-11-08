// src/shared/types/content/inline/link.inline.content.app-init.type.ts

import type { LinkInlineContentAuthored } from "../../../../content-schema/content/inline/link.inline.content.content-schema.authored.type";
import type { LinkAppInit } from "../primitives/link.primitive.content.shared.app-init.type";
import type { OmitAndReplace } from "../../../../shared/types/utilities/omit-replace.utility.shared.type";

export type LinkInlineContentAppInit = OmitAndReplace<
  LinkInlineContentAuthored,
  {
    link: LinkAppInit;
  }
>;
