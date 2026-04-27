// shared-types/page-content/block/app-render-context.block.page-content.types.ts

import type { AppRenderContextParagraphBlockContentModule } from "@shared-types/page-content/block/paragraph/app-render-context.paragraph.block.page-content.types";
import type { AppRenderContextListBlockContentModule } from "@shared-types/page-content/block/list/app-render-context.list.block.page-content.types";
import type { AppRenderContextQuoteBlockContentModule } from "@shared-types/page-content/block/quote/app-render-context.quote.block.page-content.types";
import type { AppRenderContextHeroBlockContentModule } from "@shared-types/page-content/block/hero/app-render-context.hero.block.page-content.types";
import type { AppRenderContextJournalListingBlockContentModule } from "@shared-types/page-content/block/journal-listing/app-render-context.journal-listing.block.page-content.types";
import type { AppRenderContextArticleSectionBlockContentModule } from "@shared-types/page-content/block/article-section/app-render-context.article-section.block.page-content.types";
import type { AppRenderContextPreBlockContentModule } from "@shared-types/page-content/block/pre/app-render-context.pre.block.page-content.types";

export type AppRenderContextBlockContentModule =
  | AppRenderContextParagraphBlockContentModule
  | AppRenderContextListBlockContentModule
  | AppRenderContextQuoteBlockContentModule
  | AppRenderContextHeroBlockContentModule
  | AppRenderContextJournalListingBlockContentModule
  | AppRenderContextArticleSectionBlockContentModule
  | AppRenderContextPreBlockContentModule;
