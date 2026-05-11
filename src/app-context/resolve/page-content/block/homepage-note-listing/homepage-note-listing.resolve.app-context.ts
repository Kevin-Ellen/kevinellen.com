// src/app-context/resolve/page-content/block/homepage-note-listing/homepage-note-listing.resolve.app-context.ts

import type { AppStateHomepageNoteListingBlock } from "@shared-types/page-content/block/homepage-note-listing/app-state.homepage-note-listing.block.types";
import type { AppContextHomepageNoteListingBlock } from "@shared-types/page-content/block/homepage-note-listing/app-context.homepage-note-listing.block.types";
import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

import { appContextResolveNoteListingItems } from "@app-context/resolve/page-content/shared/note-listing-items.resolve.app-context";

export const appContextResolveHomepageNoteListingBlock = (
  module: AppStateHomepageNoteListingBlock,
  context: AppContextPageContentResolverContext,
): AppContextHomepageNoteListingBlock => {
  return {
    ...module,
    notes: appContextResolveNoteListingItems(context).slice(
      0,
      module.itemCount,
    ),
  };
};
