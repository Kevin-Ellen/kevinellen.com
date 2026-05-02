// shared-types/page-content/block/journal-listing/authored.journal-listing.block.page-content.types.ts

import type { AuthoredBaseBlockContentModule } from "@shared-types/page-content/block/base/authored.base.block.page-content.types";
import type { AuthoredPagination } from "@shared-types/page-content/shared/pagination/authored.pagination.page-content.types";

export type AuthoredJournalListingBlockContentModule =
  AuthoredBaseBlockContentModule<
    "journalListing",
    {
      pagination: AuthoredPagination;
    }
  >;
