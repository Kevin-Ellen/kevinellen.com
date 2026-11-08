// src/content-schema/content/inline/inline.content.content-schema.authored.type.ts

import type { LinkInlineContentAuthored } from "./link.inline.content.content-schema.authored.type";
import type { TextInlineContentAuthored } from "./text.inline.content.content-schema.authored.type";

export type InlineContentAuthored =
  | LinkInlineContentAuthored
  | TextInlineContentAuthored;
