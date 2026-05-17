// src/app-state/resolve/page-content/block/note-listing/note-listing.resolve.app-state.ts

import type { AuthoredNoteListingBlock } from "@shared-types/page-content/block/note-listing/authored.note-listing.block.types";
import type { AppStateNoteListingBlock } from "@shared-types/page-content/block/note-listing/app-state.note-listing.block.types";

export const appStateResolveNoteListingBlock = (
  module: AuthoredNoteListingBlock,
): AppStateNoteListingBlock => {
  return {
    ...module,
    flow: module.flow ?? "content",
  };
};
