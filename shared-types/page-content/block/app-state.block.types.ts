// shared-types/page-content/block/app-state.block.types.ts

import type { AppStateParagraphBlock } from "@shared-types/page-content/block/paragraph/app-state.paragraph.block.types";
import type { AppStateListBlock } from "@shared-types/page-content/block/list/app-state.list.block.types";
import type { AppStateQuoteBlock } from "@shared-types/page-content/block/quote/app-state.quote.block.types";
import type { AppStateHeroBlock } from "@shared-types/page-content/block/hero/app-state.hero.block.types";
import type { AppStateJournalListingBlock } from "@shared-types/page-content/block/journal-listing/app-state.journal-listing.block.types";
import type { AppStateArticleSectionBlock } from "@shared-types/page-content/block/article-section/app-state.article-section.block.types";
import type { AppStatePreBlock } from "@shared-types/page-content/block/pre/app-state.pre.block.types";
import type { AppStateHomepageHeroBlock } from "@shared-types/page-content/block/homepage-hero/app-state.homepage-hero.block.types";
import type { AppStateImageStripBlock } from "@shared-types/page-content/block/image-strip/app-state.image-strip.block.types";
import type { AppStateHomepageJournalListingBlock } from "@shared-types/page-content/block/homepage-journal-listing/app-state.homepage-journal-listing.block.types";
import type { AppStateSectionLinksBlock } from "@shared-types/page-content/block/section-links/app-state.section-links.block.types";
import type { AppStateNoteListingBlock } from "@shared-types/page-content/block/note-listing/app-state.note-listing.block.types";
import type { AppStateHomepageNoteListingBlock } from "@shared-types/page-content/block/homepage-note-listing/app-state.homepage-note-listing.block.types";

export type AppStateBlock =
  | AppStateParagraphBlock
  | AppStateListBlock
  | AppStateQuoteBlock
  | AppStateHeroBlock
  | AppStateJournalListingBlock
  | AppStateArticleSectionBlock
  | AppStatePreBlock
  | AppStateHomepageHeroBlock
  | AppStateImageStripBlock
  | AppStateHomepageJournalListingBlock
  | AppStateSectionLinksBlock
  | AppStateNoteListingBlock
  | AppStateHomepageNoteListingBlock;
