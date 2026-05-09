// shared-types/page-content/block/homepage-journal-listing/app-context.homepage-journal-listing.block.types.ts

import type { AppStateHomepageJournalListingBlock } from "@shared-types/page-content/block/homepage-journal-listing/app-state.homepage-journal-listing.block.types";
import type { AppContextJournalListingItem } from "@shared-types/page-content/block/journal-listing/app-context.journal-listing.block.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type ResolvedFields = Readonly<{
  entries: readonly AppContextJournalListingItem[];
}>;

export type AppContextHomepageJournalListingBlock = Replace<
  AppStateHomepageJournalListingBlock,
  ResolvedFields
>;
