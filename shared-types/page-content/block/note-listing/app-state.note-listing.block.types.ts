// shared-types/page-content/block/note-listing/app-state.note-listing.block.types.ts

import type { AuthoredNoteListingBlock } from "@shared-types/page-content/block/note-listing/authored.note-listing.block.types";
import type { BlockFlow } from "@shared-types/page-content/block/shared.block.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type DeterministicFields = Readonly<{
  flow: BlockFlow;
}>;

export type AppStateNoteListingBlock = Replace<
  AuthoredNoteListingBlock,
  DeterministicFields
>;
