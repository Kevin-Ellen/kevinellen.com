// src/app-render-context/resolve/body-content/block/journal-listing.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextJournalListingBlock } from "@shared-types/page-content/block/journal-listing/app-context.journal-listing.block.types";
import type { AppRenderContextJournalListingBlock } from "@shared-types/page-content/block/journal-listing/app-render-context.journal-listing.block.types";

import { formatDate } from "@utils/date.format.util";
import { appRenderContextResolvePagination } from "@app-render-context/resolve/body-content/shared/pagination.resolve.app-render-context";
import { appRenderContextResolvePhoto } from "@app-render-context/resolve/media/photo.resolve.app-render-context";

export const appRenderContextResolveJournalListingBlock = (
  appContext: AppContext,
  block: AppContextJournalListingBlock,
): AppRenderContextJournalListingBlock => ({
  ...block,
  pagination: appRenderContextResolvePagination(block.pagination),
  items: block.items.map((item) => ({
    ...item,
    image:
      item.image === null
        ? null
        : appRenderContextResolvePhoto(item.image, appContext.metadataLabels),
    publishedLabel:
      item.publishedAt === null ? null : formatDate(item.publishedAt),
  })),
});
