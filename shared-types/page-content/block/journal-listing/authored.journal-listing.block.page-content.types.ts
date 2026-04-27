// shared-types/page-content/block/journal-listing/authored.journal-listing.block.page-content.types.ts

import type { AuthoredBaseBlockContentModule } from "@shared-types/page-content/block/base/authored.base.block.page-content.types";
import type { BlockContentModulePagination } from "@shared-types/page-content/block/shared.block.content.types";

export type AuthoredJournalListingBlockContentModule =
  AuthoredBaseBlockContentModule<
    "journalListing",
    {
      pagination: BlockContentModulePagination;
    }
  >;
