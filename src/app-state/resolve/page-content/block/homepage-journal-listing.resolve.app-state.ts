// src/app-state/resolve/page-content/block/homepage-journal-listing.resolve.app-state.ts

import type { AuthoredHomepageJournalListingBlock } from "@shared-types/page-content/block/homepage-journal-listing/authored.homepage-journal-listing.block.types";
import type { AppStateHomepageJournalListingBlock } from "@shared-types/page-content/block/homepage-journal-listing/app-state.homepage-journal-listing.block.types";

export const appStateResolveHomepageJournalListingBlock = (
  module: AuthoredHomepageJournalListingBlock,
): AppStateHomepageJournalListingBlock => ({
  ...module,
  flow: "content",
  itemCount: module.itemCount ?? 5,
});
