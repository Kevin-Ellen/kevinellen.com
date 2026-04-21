// src/app-context/resolve/page/content/block/journal-listing.resolve.app-context.ts

import type { AppStateJournalListingBlockContentModule } from "@shared-types/page-content/block/journal-listing/app-state.journal-listing.block.page-content.types";
import type { AppContextJournalListingBlockContentModule } from "@shared-types/page-content/block/journal-listing/app-context.journal-listing.block.page-content.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

export const appContextResolveJournalListingBlockContentModule = (
  module: AppStateJournalListingBlockContentModule,
  _context: AppContextPageContentResolverContext,
): AppContextJournalListingBlockContentModule => {
  return module;
};
