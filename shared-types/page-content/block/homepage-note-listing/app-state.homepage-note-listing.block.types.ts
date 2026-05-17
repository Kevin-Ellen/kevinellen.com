// shared-types/page-content/block/homepage-note-listing/app-state.homepage-note-listing.block.types.ts

import type { AppStateArticleSectionHeadingBlock } from "@shared-types/page-content/block/article-section/app-state.article-section.block.types";
import type { AuthoredHomepageNoteListingBlock } from "@shared-types/page-content/block/homepage-note-listing/authored.homepage-note-listing.block.types";
import type { BlockFlow } from "@shared-types/page-content/block/shared.block.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type DeterministicFields = Readonly<{
  heading: AppStateArticleSectionHeadingBlock;
  itemCount: number;
  flow: Extract<BlockFlow, "content">;
}>;

export type AppStateHomepageNoteListingBlock = Replace<
  AuthoredHomepageNoteListingBlock,
  DeterministicFields
>;
