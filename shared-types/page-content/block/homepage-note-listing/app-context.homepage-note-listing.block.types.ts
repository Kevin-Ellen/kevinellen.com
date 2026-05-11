// shared-types/page-content/block/homepage-note-listing/app-context.homepage-note-listing.block.types.ts

import type { AppStateHomepageNoteListingBlock } from "@shared-types/page-content/block/homepage-note-listing/app-state.homepage-note-listing.block.types";
import type { AppContextNoteListingItem } from "@shared-types/page-content/block/note-listing/app-context.note-listing.block.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type ResolvedFields = Readonly<{
  notes: readonly AppContextNoteListingItem[];
}>;

export type AppContextHomepageNoteListingBlock = Replace<
  AppStateHomepageNoteListingBlock,
  ResolvedFields
>;
