// shared-types/page-content/authored.page-content.types.ts

import type { AuthoredPageContentHead } from "@shared-types/page-content/site/content-head/authored.content-head.page-content.types";
import type { AuthoredBlockContentModule } from "@shared-types/page-content/block/authored.block.page-content.types";
import type { AuthoredPageContentFooterModule } from "@shared-types/page-content/footer/authored.page-footer.page-content.types";

export type AuthoredPageContent = Readonly<{
  header: AuthoredPageContentHead;
  content: readonly AuthoredBlockContentModule[];
  footer?: readonly AuthoredPageContentFooterModule[];
}>;
