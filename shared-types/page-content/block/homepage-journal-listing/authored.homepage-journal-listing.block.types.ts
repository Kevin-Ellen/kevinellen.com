// shared-types/page-content/block/homepage-journal-listing/authored.homepage-journal-listing.block.types.ts

import type { AuthoredBaseBlock } from "@shared-types/page-content/block/base/authored.base.block.types";
import type { AuthoredArticleSectionHeadingBlock } from "@shared-types/page-content/block/article-section/authored.article-section.block.types";

export type AuthoredHomepageJournalListingBlock = AuthoredBaseBlock<
  "homepageJournalListing",
  {
    heading: AuthoredArticleSectionHeadingBlock;
    itemCount?: number;
  }
>;
