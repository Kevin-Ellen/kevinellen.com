// shared-types/page-content/block/journal-listing/app-context.journal-listing.block.types.ts

import type { AppStateJournalListingBlock } from "@shared-types/page-content/block/journal-listing/app-state.journal-listing.block.types";
import type { AppContextPagination } from "@shared-types/page-content/shared/pagination/app-context.pagination.shared.types";
import type { AppContextPhotoMetadata } from "@shared-types/media/photo/app-context.photo.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppContextJournalListingItem = Readonly<{
  id: string;
  href: string;
  title: string;
  intro: string | null;
  eyebrow: string | null;
  publishedAt: string | null;
  image: AppContextPhotoMetadata | null;
}>;

type RuntimeFields = Readonly<{
  items: readonly AppContextJournalListingItem[];
  pagination: AppContextPagination;
}>;

export type AppContextJournalListingBlock = Replace<
  AppStateJournalListingBlock,
  RuntimeFields
>;
