// shared-types/page-content/block/note-listing/authored.note-listing.block.types.ts

import type { AuthoredBaseBlock } from "@shared-types/page-content/block/base/authored.base.block.types";
import type { AuthoredPagination } from "@shared-types/page-content/shared/pagination/authored.pagination.shared.types";

export type AuthoredNoteListingBlock = AuthoredBaseBlock<
  "noteListing",
  {
    pagination: AuthoredPagination;
  }
>;
