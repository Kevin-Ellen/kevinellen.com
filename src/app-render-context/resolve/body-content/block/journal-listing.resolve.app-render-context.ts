// src/app-render-context/resolve/body-content/block/journal-listing.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextJournalListingBlockContentModule } from "@shared-types/page-content/block/journal-listing/app-context.journal-listing.block.page-content.types";
import type { AppRenderContextJournalListingBlockContentModule } from "@shared-types/page-content/block/journal-listing/app-render-context.journal-listing.block.page-content.types";

import { formatDate } from "@utils/date.format.util";
import { resolvePaginationAppRenderContext } from "@app-render-context/resolve/body-content/shared/pagination.resolve.app-render-context";
import { resolvePhotoAppRenderContext } from "@app-render-context/resolve/media/photo.resolve.app-render-context";

export const resolveJournalListingBlockContentModuleAppRenderContext = (
  appContext: AppContext,
  module: AppContextJournalListingBlockContentModule,
): AppRenderContextJournalListingBlockContentModule => ({
  ...module,
  pagination: resolvePaginationAppRenderContext(module.pagination),
  items: module.items.map((item) => ({
    ...item,
    image:
      item.image === null
        ? null
        : resolvePhotoAppRenderContext(item.image, appContext.metadataLabels),
    publishedLabel:
      item.publishedAt === null ? null : formatDate(item.publishedAt),
  })),
});
