// shared-types/page-content/block/homepage-journal-listing/app-state.homepage-journal-listing.block.types.ts

import type { AuthoredHomepageJournalListingBlock } from "@shared-types/page-content/block/homepage-journal-listing/authored.homepage-journal-listing.block.types";
import type { BlockContentModuleFlow } from "@shared-types/page-content/block/shared.block.content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppStateHomepageJournalListingBlockDeterministicFields = Readonly<{
  itemCount: number;
  flow: Extract<BlockContentModuleFlow, "content">;
}>;

export type AppStateHomepageJournalListingBlock = Replace<
  AuthoredHomepageJournalListingBlock,
  AppStateHomepageJournalListingBlockDeterministicFields
>;
