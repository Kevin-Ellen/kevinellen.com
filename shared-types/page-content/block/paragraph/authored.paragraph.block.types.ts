// shared-types/page-content/block/paragraph/authored.paragraph.block.types.ts

import type { AuthoredInline } from "@shared-types/page-content/inline/authored.inline-content.types";
import type { AuthoredBaseBlock } from "@shared-types/page-content/block/base/authored.base.block.types";

export type AuthoredParagraphBlock = AuthoredBaseBlock<
  "paragraph",
  {
    content: readonly AuthoredInline[];
  }
>;
