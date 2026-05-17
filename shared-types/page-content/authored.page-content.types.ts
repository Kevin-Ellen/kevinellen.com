// shared-types/page-content/authored.page-content.types.ts

import type { AuthoredPageContentHead } from "@shared-types/page-content/site/content-head/authored.content-head.types";
import type { AuthoredBlock } from "@shared-types/page-content/block/authored.block.types";
import type { AuthoredPageContentFooter } from "@shared-types/page-content/footer/authored.page-footer.types";

export type AuthoredPageContent = Readonly<{
  head: AuthoredPageContentHead;
  content: readonly AuthoredBlock[];
  footer?: readonly AuthoredPageContentFooter[];
}>;
