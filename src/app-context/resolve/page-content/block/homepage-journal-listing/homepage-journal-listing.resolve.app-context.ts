// src/app-context/resolve/page-content/block/homepage-journal-listing/homepage-journal-listing.resolve.app-context.ts

import type { AppStateHomepageJournalListingBlock } from "@shared-types/page-content/block/homepage-journal-listing/app-state.homepage-journal-listing.block.types";
import type { AppContextHomepageJournalListingBlock } from "@shared-types/page-content/block/homepage-journal-listing/app-context.homepage-journal-listing.block.types";
import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

import { appContextResolveJournalListingItems } from "@app-context/resolve/page-content/shared/journal-listing-items.resolve.app-context";

export const appContextResolveHomepageJournalListingBlock = (
  module: AppStateHomepageJournalListingBlock,
  context: AppContextPageContentResolverContext,
): AppContextHomepageJournalListingBlock => {
  return {
    ...module,
    entries: appContextResolveJournalListingItems(context).slice(
      0,
      module.itemCount,
    ),
  };
};
