// shared-types/page-content/block/journal-listing/app-context.journal-listing.block.page-content.types.ts

import type { AppStateJournalListingBlockContentModule } from "@shared-types/page-content/block/journal-listing/app-state.journal-listing.block.page-content.types";
import type { AppContextPagination } from "@shared-types/page-content/shared/pagination/app-context.pagination.page-content.types";
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

type AppContextJournalListingBlockContentModuleRuntimeFields = Readonly<{
  items: readonly AppContextJournalListingItem[];
  pagination: AppContextPagination;
}>;

export type AppContextJournalListingBlockContentModule = Replace<
  AppStateJournalListingBlockContentModule,
  AppContextJournalListingBlockContentModuleRuntimeFields
>;

export type AppContextJournalListingModuleItem =
  AppContextJournalListingBlockContentModule["items"][number];
