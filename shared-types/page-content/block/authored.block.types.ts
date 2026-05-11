// shared-types/page-content/block/authored.block.types.ts

import type { AuthoredParagraphBlock } from "@shared-types/page-content/block/paragraph/authored.paragraph.block.types";
import type { AuthoredListBlock } from "@shared-types/page-content/block/list/authored.list.block.types";
import type { AuthoredQuoteBlock } from "@shared-types/page-content/block/quote/authored.quote.block.types";
import type { AuthoredHeroBlock } from "@shared-types/page-content/block/hero/authored.hero.block.types";
import type { AuthoredJournalListingBlock } from "@shared-types/page-content/block/journal-listing/authored.journal-listing.block.types";
import type { AuthoredArticleSectionBlock } from "@shared-types/page-content/block/article-section/authored.article-section.block.types";
import type { AuthoredPreBlock } from "@shared-types/page-content/block/pre/authored.pre.block.types";
import type { AuthoredHomepageHeroBlock } from "@shared-types/page-content/block/homepage-hero/authored.homepage-hero.block.types";
import type { AuthoredImageStripBlock } from "@shared-types/page-content/block/image-strip/authored.image-strip.block.types";
import type { AuthoredHomepageJournalListingBlock } from "@shared-types/page-content/block/homepage-journal-listing/authored.homepage-journal-listing.block.types";
import type { AuthoredSectionLinksBlock } from "@shared-types/page-content/block/section-links/authored.section-links.block.types";
import type { AuthoredNoteListingBlock } from "@shared-types/page-content/block/note-listing/authored.note-listing.block.types";
import type { AuthoredHomepageNoteListingBlock } from "@shared-types/page-content/block/homepage-note-listing/authored.homepage-note-listing.block.types";

export type AuthoredBlock =
  | AuthoredParagraphBlock
  | AuthoredListBlock
  | AuthoredQuoteBlock
  | AuthoredHeroBlock
  | AuthoredJournalListingBlock
  | AuthoredArticleSectionBlock
  | AuthoredPreBlock
  | AuthoredHomepageHeroBlock
  | AuthoredImageStripBlock
  | AuthoredHomepageJournalListingBlock
  | AuthoredSectionLinksBlock
  | AuthoredNoteListingBlock
  | AuthoredHomepageNoteListingBlock;
