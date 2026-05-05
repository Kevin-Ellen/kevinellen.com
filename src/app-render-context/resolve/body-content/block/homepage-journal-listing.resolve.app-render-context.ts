// src/app-render-context/resolve/body-content/block/homepage-journal-listing.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextHomepageJournalListingBlock } from "@shared-types/page-content/block/homepage-journal-listing/app-context.homepage-journal-listing.block.types";
import type { AppRenderContextHomepageJournalListingBlock } from "@shared-types/page-content/block/homepage-journal-listing/app-render-context.homepage-journal-listing.block.types";

import { resolvePhotoAppRenderContext } from "@app-render-context/resolve/media/photo.resolve.app-render-context";
import { formatDate } from "@utils/date.format.util";

export const resolveHomepageJournalListingBlockAppRenderContext = (
  appContext: AppContext,
  module: AppContextHomepageJournalListingBlock,
): AppRenderContextHomepageJournalListingBlock => ({
  ...module, // ← THIS carries heading through
  entries: module.entries.map((entry) => ({
    id: entry.id,
    href: entry.href,
    title: entry.title,
    intro: entry.intro,
    eyebrow: entry.eyebrow,
    publishedAt: entry.publishedAt,
    publishedLabel:
      entry.publishedAt === null ? null : formatDate(entry.publishedAt),
    image:
      entry.image === null
        ? null
        : resolvePhotoAppRenderContext(entry.image, appContext.metadataLabels),
  })),
});
