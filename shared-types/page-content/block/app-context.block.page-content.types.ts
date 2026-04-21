// shared-types/page-content/block/app-context.block.page-content.types.ts

import type { AppContextParagraphBlockContentModule } from "@shared-types/page-content/block/paragraph/app-context.paragraph.block.page-content.types";
import type { AppContextListBlockContentModule } from "@shared-types/page-content/block/list/app-context.list.block.page-content.types";
import type { AppContextQuoteBlockContentModule } from "@shared-types/page-content/block/quote/app-context.quote.block.page-content.types";
import type { AppContextHeroBlockContentModule } from "@shared-types/page-content/block/hero/app-context.hero.block.page-content.types";
import type { AppContextJournalListingBlockContentModule } from "@shared-types/page-content/block/journal-listing/app-context.journal-listing.block.page-content.types";
import type { AppContextContentSectionBlockContentModule } from "@shared-types/page-content/block/content-section/app-context.content-section.block.page-content.types";
import type { AppContextPreBlockContentModule } from "@shared-types/page-content/block/pre/app-context.pre.block.page-content.types";

export type AppContextBlockContentModule =
  | AppContextParagraphBlockContentModule
  | AppContextListBlockContentModule
  | AppContextQuoteBlockContentModule
  | AppContextHeroBlockContentModule
  | AppContextJournalListingBlockContentModule
  | AppContextContentSectionBlockContentModule
  | AppContextPreBlockContentModule;
