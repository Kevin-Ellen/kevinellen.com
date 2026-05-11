// src/app-state/resolve/page-content/block/homepage-note-listing/homepage-note-listing.resolve.app-state.ts

import type { AuthoredHomepageNoteListingBlock } from "@shared-types/page-content/block/homepage-note-listing/authored.homepage-note-listing.block.types";
import type { AppStateHomepageNoteListingBlock } from "@shared-types/page-content/block/homepage-note-listing/app-state.homepage-note-listing.block.types";

import { appStateResolveArticleSectionHeadingBlock } from "@app-state/resolve/page-content/block/article-section/article-section.resolve.app-state";

export const appStateResolveHomepageNoteListingBlock = (
  module: AuthoredHomepageNoteListingBlock,
): AppStateHomepageNoteListingBlock => ({
  ...module,
  heading: appStateResolveArticleSectionHeadingBlock(module.heading),
  flow: "content",
  itemCount: module.itemCount ?? 5,
});
