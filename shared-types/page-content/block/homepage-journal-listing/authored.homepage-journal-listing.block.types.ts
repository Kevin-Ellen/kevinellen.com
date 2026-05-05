// shared-types/page-content/block/homepage-journal-listing/authored.homepage-journal-listing.block.types.ts

import type { AuthoredBaseBlockContentModule } from "@shared-types/page-content/block/base/authored.base.block.page-content.types";
import type { AuthoredArticleSectionHeadingBlockContentModule } from "@shared-types/page-content/block/article-section/authored.article-section.block.page-content.types";

export type AuthoredHomepageJournalListingBlock =
  AuthoredBaseBlockContentModule<
    "homepageJournalListing",
    {
      heading: AuthoredArticleSectionHeadingBlockContentModule;
      itemCount?: number;
    }
  >;
