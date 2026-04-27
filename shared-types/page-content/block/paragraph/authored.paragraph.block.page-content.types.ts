// shared-types/page-content/block/paragraph/authored.paragraph.block.page-content.types.ts

import type { AuthoredInlineContent } from "@shared-types/page-content/inline/authored.inline-content.page-content.types";
import type { AuthoredBaseBlockContentModule } from "@shared-types/page-content/block/base/authored.base.block.page-content.types";

export type AuthoredParagraphBlockContentModule =
  AuthoredBaseBlockContentModule<
    "paragraph",
    {
      content: readonly AuthoredInlineContent[];
    }
  >;
