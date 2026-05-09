// shared-types/page-content/block/app-context.block.types.ts

import type { AppContextParagraphBlock } from "@shared-types/page-content/block/paragraph/app-context.paragraph.block.types";
import type { AppContextListBlock } from "@shared-types/page-content/block/list/app-context.list.block.types";
import type { AppContextQuoteBlock } from "@shared-types/page-content/block/quote/app-context.quote.block.types";
import type { AppContextHeroBlock } from "@shared-types/page-content/block/hero/app-context.hero.block.types";
import type { AppContextJournalListingBlock } from "@shared-types/page-content/block/journal-listing/app-context.journal-listing.block.types";
import type { AppContextArticleSectionBlock } from "@shared-types/page-content/block/article-section/app-context.article-section.block.types";
import type { AppContextPreBlock } from "@shared-types/page-content/block/pre/app-context.pre.block.types";
import type { AppContextHomepageHeroBlock } from "@shared-types/page-content/block/homepage-hero/app-context.homepage-hero.block.types";
import type { AppContextImageStripBlock } from "@shared-types/page-content/block/image-strip/app-context.image-strip.block.types";
import type { AppContextHomepageJournalListingBlock } from "@shared-types/page-content/block/homepage-journal-listing/app-context.homepage-journal-listing.block.types";
import type { AppContextSectionLinksBlock } from "@shared-types/page-content/block/section-links/app-context.section-links.block.types";

export type AppContextBlock =
  | AppContextParagraphBlock
  | AppContextListBlock
  | AppContextQuoteBlock
  | AppContextHeroBlock
  | AppContextJournalListingBlock
  | AppContextArticleSectionBlock
  | AppContextPreBlock
  | AppContextHomepageHeroBlock
  | AppContextImageStripBlock
  | AppContextHomepageJournalListingBlock
  | AppContextSectionLinksBlock;
