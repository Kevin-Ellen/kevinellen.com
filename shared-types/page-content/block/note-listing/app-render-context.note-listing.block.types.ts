// shared-types/page-content/block/note-listing/app-render-context.note-listing.block.types.ts

import type {
  AppContextNoteListingBlock,
  AppContextNoteListingItem,
} from "@shared-types/page-content/block/note-listing/app-context.note-listing.block.types";
import type { AppRenderContextPagination } from "@shared-types/page-content/shared/pagination/app-render-context.pagination.shared.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppRenderContextNoteListingItem = Replace<
  AppContextNoteListingItem,
  {
    publishedLabel: string | null;
  }
>;

type RuntimeFields = Readonly<{
  items: readonly AppRenderContextNoteListingItem[];
  pagination: AppRenderContextPagination;
}>;

export type AppRenderContextNoteListingBlock = Replace<
  AppContextNoteListingBlock,
  RuntimeFields
>;
