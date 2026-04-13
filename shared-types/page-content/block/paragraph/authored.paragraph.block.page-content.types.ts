// shared-types/page-content/block/paragraph/authored.paragraph.block.page-content.types.ts

import type { AuthoredInlineContent } from "@shared-types/page-content/inline/authored.inline-content.page-content.types";

export type AuthoredParagraphBlockContentModule = Readonly<{
  kind: "paragraph";
  content: readonly AuthoredInlineContent[];
}>;
