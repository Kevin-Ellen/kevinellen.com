// src/app-state/resolve/page-content/block/journal-listing.resolve.app-state.ts

import type { AuthoredJournalListingBlockContentModule } from "@shared-types/page-content/block/journal-listing/authored.journal-listing.block.page-content.types";
import type { AppStateJournalListingBlockContentModule } from "@shared-types/page-content/block/journal-listing/app-state.journal-listing.block.page-content.types";

export const appStateResolveJournalListingBlockContentModule = (
  module: AuthoredJournalListingBlockContentModule,
): AppStateJournalListingBlockContentModule => {
  return {
    ...module,
    flow: module.flow ?? "content",
  };
};
