// shared-types/page-content/block/authored.block.page-content.types.ts

import type { AuthoredParagraphBlockContentModule } from "@shared-types/page-content/block/paragraph/authored.paragraph.block.page-content.types";
import type { AuthoredListBlockContentModule } from "@shared-types/page-content/block/list/authored.list.block.page-content.types";
import type { AuthoredQuoteBlockContentModule } from "@shared-types/page-content/block/quote/authored.quote.block.page-content.types";
import type { AuthoredHeroBlockContentModule } from "@shared-types/page-content/block/hero/authored.hero.block.page-content.types";
import type { AuthoredJournalListingBlockContentModule } from "@shared-types/page-content/block/journal-listing/authored.journal-listing.block.page-content.types";
import type { AuthoredArticleSectionBlockContentModule } from "@shared-types/page-content/block/article-section/authored.article-section.block.page-content.types";
import type { AuthoredPreBlockContentModule } from "@shared-types/page-content/block/pre/authored.pre.block.page-content.types";
import type { AuthoredJournalEntryFooterBlockContentModule } from "@shared-types/page-content/block/journal-entry-footer/authored.journal-entry-footer.block.page-content.types";

export type AuthoredBlockContentModule =
  | AuthoredParagraphBlockContentModule
  | AuthoredListBlockContentModule
  | AuthoredQuoteBlockContentModule
  | AuthoredHeroBlockContentModule
  | AuthoredJournalListingBlockContentModule
  | AuthoredArticleSectionBlockContentModule
  | AuthoredPreBlockContentModule
  | AuthoredJournalEntryFooterBlockContentModule;
