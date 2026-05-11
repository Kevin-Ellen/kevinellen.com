// shared-types/page-content/block/app-render-context.block.types.ts

import type { AppRenderContextParagraphBlock } from "@shared-types/page-content/block/paragraph/app-render-context.paragraph.block.types";
import type { AppRenderContextListBlock } from "@shared-types/page-content/block/list/app-render-context.list.block.types";
import type { AppRenderContextQuoteBlock } from "@shared-types/page-content/block/quote/app-render-context.quote.block.types";
import type { AppRenderContextHeroBlock } from "@shared-types/page-content/block/hero/app-render-context.hero.block.types";
import type { AppRenderContextJournalListingBlock } from "@shared-types/page-content/block/journal-listing/app-render-context.journal-listing.block.types";
import type { AppRenderContextArticleSectionBlock } from "@shared-types/page-content/block/article-section/app-render-context.article-section.block.types";
import type { AppRenderContextPreBlock } from "@shared-types/page-content/block/pre/app-render-context.pre.block.types";
import type { AppRenderContextHomepageHeroBlock } from "@shared-types/page-content/block/homepage-hero/app-render-context.homepage-hero.block.types";
import type { AppRenderContextImageStripBlock } from "@shared-types/page-content/block/image-strip/app-render-context.image-strip.block.types";
import type { AppRenderContextHomepageJournalListingBlock } from "@shared-types/page-content/block/homepage-journal-listing/app-render-context.homepage-journal-listing.block.types";
import type { AppRenderContextSectionLinksBlock } from "@shared-types/page-content/block/section-links/app-render-context.section-links.block.types";
import type { AppRenderContextNoteListingBlock } from "@shared-types/page-content/block/note-listing/app-render-context.note-listing.block.types";
import type { AppRenderContextHomepageNoteListingBlock } from "@shared-types/page-content/block/homepage-note-listing/app-render-context.homepage-note-listing.block.types";

export type AppRenderContextBlock =
  | AppRenderContextParagraphBlock
  | AppRenderContextListBlock
  | AppRenderContextQuoteBlock
  | AppRenderContextHeroBlock
  | AppRenderContextJournalListingBlock
  | AppRenderContextArticleSectionBlock
  | AppRenderContextPreBlock
  | AppRenderContextHomepageHeroBlock
  | AppRenderContextImageStripBlock
  | AppRenderContextHomepageJournalListingBlock
  | AppRenderContextSectionLinksBlock
  | AppRenderContextNoteListingBlock
  | AppRenderContextHomepageNoteListingBlock;
