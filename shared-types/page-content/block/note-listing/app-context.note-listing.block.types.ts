// shared-types/page-content/block/note-listing/app-context.note-listing.block.types.ts

import type { AppStateNoteListingBlock } from "@shared-types/page-content/block/note-listing/app-state.note-listing.block.types";
import type { AppContextPagination } from "@shared-types/page-content/shared/pagination/app-context.pagination.shared.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppContextNoteListingItem = Readonly<{
  id: string;
  href: string;
  title: string;
  intro: string | null;
  eyebrow: string | null;
  publishedAt: string | null;
  topic: string | null;
}>;

type RuntimeFields = Readonly<{
  items: readonly AppContextNoteListingItem[];
  pagination: AppContextPagination;
}>;

export type AppContextNoteListingBlock = Replace<
  AppStateNoteListingBlock,
  RuntimeFields
>;
