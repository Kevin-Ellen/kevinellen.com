// shared-types/page-content/block/homepage-journal-listing/app-render-context.homepage-journal-listing.block.types.ts

import type { AppContextHomepageJournalListingBlock } from "@shared-types/page-content/block/homepage-journal-listing/app-context.homepage-journal-listing.block.types";
import type { AppRenderContextRenderImage } from "@shared-types/media/render-image/app-render-context.render-image.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppRenderContextHomepageJournalListingItem = Readonly<{
  id: string;
  href: string;
  title: string;
  intro: string | null;
  eyebrow: string | null;
  publishedAt: string | null;
  publishedLabel: string | null;
  image: AppRenderContextRenderImage | null;
}>;

type ResolvedFields = Readonly<{
  entries: readonly AppRenderContextHomepageJournalListingItem[];
}>;

export type AppRenderContextHomepageJournalListingBlock = Replace<
  AppContextHomepageJournalListingBlock,
  ResolvedFields
>;
