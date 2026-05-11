// src/app-context/resolve/page-content/block/note-listing/note-listing.resolve.app-context.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppContextNoteListingBlock } from "@shared-types/page-content/block/note-listing/app-context.note-listing.block.types";
import type { AppStateNoteListingBlock } from "@shared-types/page-content/block/note-listing/app-state.note-listing.block.types";

import { appContextResolveNoteListingItems } from "@app-context/resolve/page-content/shared/note-listing-items.resolve.app-context";
import { appContextResolvePagination } from "@app-context/resolve/page-content/shared/pagination.resolve.app-context";

export const appContextResolveNoteListingBlock = (
  module: AppStateNoteListingBlock,
  context: AppContextPageContentResolverContext,
): AppContextNoteListingBlock => {
  const currentPage = context.routingPagination?.currentPage ?? 1;
  const noteItems = appContextResolveNoteListingItems(context);

  const baseHref = context.currentPageSlug;

  if (baseHref === null) {
    throw new Error("Missing current page slug for note listing pagination.");
  }

  const pagination = appContextResolvePagination({
    pagination: module.pagination,
    currentPage,
    totalItems: noteItems.length,
    baseHref,
  });

  const start = (pagination.currentPage - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;

  return {
    kind: module.kind,
    flow: module.flow,
    pagination,
    items: noteItems.slice(start, end),
  };
};
