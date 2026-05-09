// shared-types/page-content/block/journal-listing/app-render-context.journal-listing.block.types.ts

import type { AppContextJournalListingBlock } from "@shared-types/page-content/block/journal-listing/app-context.journal-listing.block.types";
import type { AppRenderContextPagination } from "@shared-types/page-content/shared/pagination/app-render-context.pagination.shared.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";
import type { AppRenderContextPhoto } from "@shared-types/media/photo/app-render-context.photo.types";

export type AppRenderContextJournalListingItem = Readonly<{
  id: string;
  href: string;
  title: string;
  intro: string | null;
  eyebrow: string | null;
  publishedAt: string | null;
  publishedLabel: string | null;
  image: AppRenderContextPhoto | null;
}>;

type RuntimeFields = Readonly<{
  items: readonly AppRenderContextJournalListingItem[];
  pagination: AppRenderContextPagination;
}>;

export type AppRenderContextJournalListingBlock = Replace<
  AppContextJournalListingBlock,
  RuntimeFields
>;
