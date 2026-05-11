// src/app-render-context/resolve/body-content/block/note-listing.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextNoteListingBlock } from "@shared-types/page-content/block/note-listing/app-context.note-listing.block.types";
import type { AppRenderContextNoteListingBlock } from "@shared-types/page-content/block/note-listing/app-render-context.note-listing.block.types";

import { appRenderContextResolvePagination } from "@app-render-context/resolve/body-content/shared/pagination.resolve.app-render-context";
import { formatDate } from "@utils/date.format.util";

export const appRenderContextResolveNoteListingBlock = (
  _appContext: AppContext,
  block: AppContextNoteListingBlock,
): AppRenderContextNoteListingBlock => ({
  ...block,
  pagination: appRenderContextResolvePagination(block.pagination),
  items: block.items.map((item) => ({
    ...item,
    publishedLabel:
      item.publishedAt === null ? null : formatDate(item.publishedAt),
  })),
});
