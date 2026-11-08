// src/app/types/document/page/content/modules/journal-listing/journal-listing.module.content.page.document.app-resolve.type.ts

import type { JournalListingModuleAppInit } from "../../../../../../../shared/types/content/modules/journal-listing.module.content.shared.app-init.type";
import type { JournalLedgerEntryAppInit } from "../../../../../../../shared/types/content/kv-ledger.content.shared.type";
import type { OmitAndReplace } from "../../../../../../../shared/types/utilities/omit-replace.utility.shared.type";

import type { PhotoAppResolve } from "../../../../../photo/photo.app-resolve.type";
import type { PaginationMetadata } from "../../../../../../../shared/types/pagination/pagination.shared.type";

type JournalListingEntryAppResolve = OmitAndReplace<
  JournalLedgerEntryAppInit,
  {
    photos: readonly PhotoAppResolve[];
  }
>;

export type JournalListingModuleAppResolve = OmitAndReplace<
  Omit<JournalListingModuleAppInit, "photoLimit">,
  {
    featured: JournalListingEntryAppResolve | null;
    entries: readonly JournalListingEntryAppResolve[];
    displayFeatured: boolean;
    pagination: PaginationMetadata | null;
  }
>;
