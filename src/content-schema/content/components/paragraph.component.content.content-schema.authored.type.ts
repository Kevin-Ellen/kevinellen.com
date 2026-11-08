// src/content-schema/content/components/paragraph.component.content.content-schema.authored.type.ts

import type { InlineContentAuthored } from "../inline/inline.content.content-schema.authored.type";

export type ParagraphComponentContentAuthored = Readonly<{
  kind: "paragraph";
  content: readonly InlineContentAuthored[];
}>;
