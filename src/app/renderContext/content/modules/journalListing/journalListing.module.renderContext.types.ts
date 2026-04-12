// src/app/renderContext/content/modules/journalListing/journalListing.module.renderContext.types.ts

import type { RenderContextResponsiveImage } from "@app/renderContext/content/modules/shared-types/images.modules.renderContext.types";

export type RenderContextJournalListingEntry = {
  id: string;
  href: string;
  title: string;
  intro: string;
  publishedAt: string;
  photo: RenderContextResponsiveImage;
  isFeatured: boolean;
};

export type RenderContextJournalListingModule = {
  kind: "journalListing";
  flow: "content";
  entries: readonly RenderContextJournalListingEntry[];
};
