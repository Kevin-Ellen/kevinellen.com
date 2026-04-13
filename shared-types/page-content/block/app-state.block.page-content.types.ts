// shared-types/page-content/block/app-state.block.page-content.types.ts

import type { AppStateParagraphBlockContentModule } from "@shared-types/page-content/block/paragraph/app-state.paragraph.block.page-content.types";
import type { AppStateListBlockContentModule } from "@shared-types/page-content/block/list/app-state.list.block.page-content.types";
import type { AppStateQuoteBlockContentModule } from "@shared-types/page-content/block/quote/app-state.quote.block.page-content.types";
import type { AppStateHeroBlockContentModule } from "@shared-types/page-content/block/hero/app-state.hero.block.page-content.types";
import type { AppStateJournalListingBlockContentModule } from "@shared-types/page-content/block/journal-listing/app-state.journal-listing.block.page-content.types";
import type { AppStateContentSectionBlockContentModule } from "@shared-types/page-content/block/content-section/app-state.content-section.block.page-content.types";
import type { AppStatePreBlockContentModule } from "@shared-types/page-content/block/pre/app-state.pre.block.page-content.types";

export type AppStateBlockContentModule =
  | AppStateParagraphBlockContentModule
  | AppStateListBlockContentModule
  | AppStateQuoteBlockContentModule
  | AppStateHeroBlockContentModule
  | AppStateJournalListingBlockContentModule
  | AppStateContentSectionBlockContentModule
  | AppStatePreBlockContentModule;
