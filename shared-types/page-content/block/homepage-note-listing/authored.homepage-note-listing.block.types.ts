// shared-types/page-content/block/homepage-note-listing/authored.homepage-note-listing.block.types.ts

import type { AuthoredArticleSectionHeadingBlock } from "@shared-types/page-content/block/article-section/authored.article-section.block.types";
import type { AuthoredBaseBlock } from "@shared-types/page-content/block/base/authored.base.block.types";

export type AuthoredHomepageNoteListingBlock = AuthoredBaseBlock<
  "homepageNoteListing",
  {
    heading: AuthoredArticleSectionHeadingBlock;
    itemCount?: number;
  }
>;
