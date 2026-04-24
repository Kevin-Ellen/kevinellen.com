// shared-types/page-content/block/journal-listing/authored.journal-listing.block.page-content.types.ts

import type { BlockContentModulePagination } from "@shared-types/page-content/block/shared.block.content.types";
import type { BlockContentModuleFlow } from "@shared-types/page-content/block/shared.block.content.types";

export type AuthoredJournalListingBlockContentModule = Readonly<{
  kind: "journalListing";
  pagination: BlockContentModulePagination;
  flow?: BlockContentModuleFlow;
}>;
