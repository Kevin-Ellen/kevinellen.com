// shared-types/page-content/block/homepage-journal-listing/app-state.homepage-journal-listing.block.types.ts

import type { AuthoredHomepageJournalListingBlock } from "@shared-types/page-content/block/homepage-journal-listing/authored.homepage-journal-listing.block.types";
import type { AppStateArticleSectionHeadingBlock } from "@shared-types/page-content/block/article-section/app-state.article-section.block.types";
import type { BlockFlow } from "@shared-types/page-content/block/shared.block.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type DeterministicFields = Readonly<{
  heading: AppStateArticleSectionHeadingBlock;
  itemCount: number;
  flow: Extract<BlockFlow, "content">;
}>;

export type AppStateHomepageJournalListingBlock = Replace<
  AuthoredHomepageJournalListingBlock,
  DeterministicFields
>;
