// shared-types/page-content/block/app-render-context.block.page-content.types.ts

import type { AppRenderContextParagraphBlockContentModule } from "@shared-types/page-content/block/paragraph/app-render-context.paragraph.block.page-content.types";
import type { AppRenderContextListBlockContentModule } from "@shared-types/page-content/block/list/app-render-context.list.block.page-content.types";
import type { AppRenderContextQuoteBlockContentModule } from "@shared-types/page-content/block/quote/app-render-context.quote.block.page-content.types";
import type { AppRenderContextHeroBlockContentModule } from "@shared-types/page-content/block/hero/app-render-context.hero.block.page-content.types";
import type { AppRenderContextJournalListingBlockContentModule } from "@shared-types/page-content/block/journal-listing/app-render-context.journal-listing.block.page-content.types";
import type { AppRenderContextArticleSectionBlockContentModule } from "@shared-types/page-content/block/article-section/app-render-context.article-section.block.page-content.types";
import type { AppRenderContextPreBlockContentModule } from "@shared-types/page-content/block/pre/app-render-context.pre.block.page-content.types";
import type { AppRenderContextHomepageHeroBlockContentModule } from "@shared-types/page-content/block/homepage-hero/app-render-context.homepage-hero.block.page-content.types";
import type { AppRenderContextImageStripBlockContentModule } from "@shared-types/page-content/block/image-strip/app-render-context.image-strip.block.page-content.types";
import type { AppRenderContextHomepageJournalListingBlock } from "@shared-types/page-content/block/homepage-journal-listing/app-render-context.homepage-journal-listing.block.types";
import type { AppRenderContextSectionLinksBlockContentModule } from "@shared-types/page-content/block/section-links/app-render-context.section-links.block.page-content.types";

export type AppRenderContextBlockContentModule =
  | AppRenderContextParagraphBlockContentModule
  | AppRenderContextListBlockContentModule
  | AppRenderContextQuoteBlockContentModule
  | AppRenderContextHeroBlockContentModule
  | AppRenderContextJournalListingBlockContentModule
  | AppRenderContextArticleSectionBlockContentModule
  | AppRenderContextPreBlockContentModule
  | AppRenderContextHomepageHeroBlockContentModule
  | AppRenderContextImageStripBlockContentModule
  | AppRenderContextHomepageJournalListingBlock
  | AppRenderContextSectionLinksBlockContentModule;
