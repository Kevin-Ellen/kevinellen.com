// src/app-context/resolve/page-content/block/journal-listing.resolve.app-context.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppContextJournalListingBlock } from "@shared-types/page-content/block/journal-listing/app-context.journal-listing.block.types";
import type { AppStateJournalListingBlock } from "@shared-types/page-content/block/journal-listing/app-state.journal-listing.block.types";

import { appContextResolveJournalListingItems } from "@app-context/resolve/page-content/shared/journal-listing-items.resolve.app-context";
import { appContextResolvePagination } from "@app-context/resolve/page-content/shared/pagination.resolve.app-context";

export const appContextResolveJournalListingBlock = (
  module: AppStateJournalListingBlock,
  context: AppContextPageContentResolverContext,
): AppContextJournalListingBlock => {
  const currentPage = context.routingPagination?.currentPage ?? 1;
  const journalItems = appContextResolveJournalListingItems(context);

  const baseHref = context.currentPageSlug;

  if (baseHref === null) {
    throw new Error(
      "Missing current page slug for journal listing pagination.",
    );
  }

  const pagination = appContextResolvePagination({
    pagination: module.pagination,
    currentPage,
    totalItems: journalItems.length,
    baseHref,
  });

  const start = (pagination.currentPage - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;

  return {
    kind: module.kind,
    flow: module.flow,
    pagination,
    items: journalItems.slice(start, end),
  };
};
