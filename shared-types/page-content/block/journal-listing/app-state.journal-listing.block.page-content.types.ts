// shared-types/page-content/block/journal-listing/app-state.journal-listing.block.page-content.types.ts

import type { AuthoredJournalListingBlockContentModule } from "@shared-types/page-content/block/journal-listing/authored.journal-listing.block.page-content.types";
import type { BlockContentModuleFlow } from "@shared-types/page-content/block/shared.block.content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppStateJournalListingBlockContentModuleDeterministicFields = Readonly<{
  flow: BlockContentModuleFlow;
}>;

export type AppStateJournalListingBlockContentModule = Replace<
  AuthoredJournalListingBlockContentModule,
  AppStateJournalListingBlockContentModuleDeterministicFields
>;
