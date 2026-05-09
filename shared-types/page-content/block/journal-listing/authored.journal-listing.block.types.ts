// shared-types/page-content/block/journal-listing/authored.journal-listing.block.types.ts

import type { AuthoredBaseBlock } from "@shared-types/page-content/block/base/authored.base.block.types";
import type { AuthoredPagination } from "@shared-types/page-content/shared/pagination/authored.pagination.shared.types";

export type AuthoredJournalListingBlock = AuthoredBaseBlock<
  "journalListing",
  {
    pagination: AuthoredPagination;
  }
>;
