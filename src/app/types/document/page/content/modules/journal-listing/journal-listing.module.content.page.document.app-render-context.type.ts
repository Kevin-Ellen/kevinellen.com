// src/app/types/document/page/content/modules/journal-listing/journal-listing.module.content.page.document.app-render-context.type.ts

import type { JournalListingModuleAppResolve } from "./journal-listing.module.content.page.document.app-resolve.type";
import type { JournalLedgerEntryAppInit } from "../../../../../../../shared/types/content/kv-ledger.content.shared.type";
import type { PhotoAppRenderContext } from "../../../../../photo/photo.app-render-context.type";
import type { OmitAndReplace } from "../../../../../../../shared/types/utilities/omit-replace.utility.shared.type";

type JournalListingEntryAppRenderContext = OmitAndReplace<
  JournalLedgerEntryAppInit,
  {
    photos: readonly PhotoAppRenderContext[];
  }
>;

type PaginationAppRenderContext = Readonly<{
  currentPage: number;
  totalPages: number;
  previous: string | null;
  next: string | null;
  pages: readonly Readonly<{
    number: number;
    href: string;
    current: boolean;
  }>[];
}>;

export type JournalListingModuleAppRenderContext = OmitAndReplace<
  JournalListingModuleAppResolve,
  {
    featured: JournalListingEntryAppRenderContext | null;
    entries: readonly JournalListingEntryAppRenderContext[];
    pagination: PaginationAppRenderContext | null;
  }
>;
