// shared-types/page-content/block/authored.block.page-content.types.ts

import type { AuthoredParagraphBlockContentModule } from "@shared-types/page-content/block/paragraph/authored.paragraph.block.page-content.types";
import type { AuthoredListBlockContentModule } from "@shared-types/page-content/block/list/authored.list.block.page-content.types";
import type { AuthoredQuoteBlockContentModule } from "@shared-types/page-content/block/quote/authored.quote.block.page-content.types";
import type { AuthoredHeroBlockContentModule } from "@shared-types/page-content/block/hero/authored.hero.block.page-content.types";
import type { AuthoredJournalListingBlockContentModule } from "@shared-types/page-content/block/journal-listing/authored.journal-listing.block.page-content.types";
import type { AuthoredArticleSectionBlockContentModule } from "@shared-types/page-content/block/article-section/authored.article-section.block.page-content.types";
import type { AuthoredPreBlockContentModule } from "@shared-types/page-content/block/pre/authored.pre.block.page-content.types";
import type { AuthoredHomepageHeroBlockContentModule } from "@shared-types/page-content/block/homepage-hero/authored.homepage-hero.block.page-content.types";
import type { AuthoredImageStripBlockContentModule } from "@shared-types/page-content/block/image-strip/authored.image-strip.block.page-content.types";
import type { AuthoredHomepageJournalListingBlock } from "@shared-types/page-content/block/homepage-journal-listing/authored.homepage-journal-listing.block.types";
import type { AuthoredSectionLinksBlockContentModule } from "@shared-types/page-content/block/section-links/authored.section-links.block.page-content.types";

export type AuthoredBlockContentModule =
  | AuthoredParagraphBlockContentModule
  | AuthoredListBlockContentModule
  | AuthoredQuoteBlockContentModule
  | AuthoredHeroBlockContentModule
  | AuthoredJournalListingBlockContentModule
  | AuthoredArticleSectionBlockContentModule
  | AuthoredPreBlockContentModule
  | AuthoredHomepageHeroBlockContentModule
  | AuthoredImageStripBlockContentModule
  | AuthoredHomepageJournalListingBlock
  | AuthoredSectionLinksBlockContentModule;
