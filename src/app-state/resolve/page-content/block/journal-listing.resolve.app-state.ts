// src/app-state/resolve/page-content/block/journal-listing.resolve.app-state.ts

import type { AuthoredJournalListingBlock } from "@shared-types/page-content/block/journal-listing/authored.journal-listing.block.types";
import type { AppStateJournalListingBlock } from "@shared-types/page-content/block/journal-listing/app-state.journal-listing.block.types";

export const appStateResolveJournalListingBlock = (
  module: AuthoredJournalListingBlock,
): AppStateJournalListingBlock => {
  return {
    ...module,
    flow: module.flow ?? "content",
  };
};
