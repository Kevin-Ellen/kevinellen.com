// shared-types/page-content/block/journal-listing/app-state.journal-listing.block.types.ts

import type { AuthoredJournalListingBlock } from "@shared-types/page-content/block/journal-listing/authored.journal-listing.block.types";
import type { BlockFlow } from "@shared-types/page-content/block/shared.block.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type DeterministicFields = Readonly<{
  flow: BlockFlow;
}>;

export type AppStateJournalListingBlock = Replace<
  AuthoredJournalListingBlock,
  DeterministicFields
>;
