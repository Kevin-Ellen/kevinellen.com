// src/app-context/resolve/page/content/block/journal-listing.resolve.app-context.ts

import type { AppStateJournalListingBlockContentModule } from "@shared-types/page-content/block/journal-listing/app-state.journal-listing.block.page-content.types";
import type { AppContextJournalListingBlockContentModule } from "@shared-types/page-content/block/journal-listing/app-context.journal-listing.block.page-content.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import { resolvePaginationAppContext } from "@app-context/resolve/page/content/shared/pagination.resolve.app-context";
import { resolveJournalListingItemsAppContext } from "@app-context/resolve/page/content/shared/journal-listing-items.resolve.app-context";

export const appContextResolveJournalListingBlockContentModule = (
  module: AppStateJournalListingBlockContentModule,
  context: AppContextPageContentResolverContext,
): AppContextJournalListingBlockContentModule => {
  const currentPage = context.routingPagination?.currentPage ?? 1;
  const journalItems = resolveJournalListingItemsAppContext(context);

  const pagination = resolvePaginationAppContext({
    pagination: module.pagination,
    currentPage,
    totalItems: journalItems.length,
    baseHref: "/journal",
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
