// src/rendering/body-content/block/journal-listing.body-content.renderer.ts

import type { AppRenderContextJournalListingBlockContentModule } from "@shared-types/page-content/block/journal-listing/app-render-context.journal-listing.block.page-content.types";

import { escapeHtml } from "@rendering/utils/html.escape.util.renderer";

export const renderJournalListingBlockContentModule = (
  module: AppRenderContextJournalListingBlockContentModule,
): string => {
  return `<section class="m-contentBlock m-journalListing" aria-label="Journal listing">
    <pre>${escapeHtml(JSON.stringify(module, null, 2))}</pre>
  </section>`;
};
