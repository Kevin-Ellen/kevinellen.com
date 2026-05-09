// shared-types/page-content/block/image-strip/authored.image-strip.block.types.ts

import type { AuthoredBaseBlock } from "@shared-types/page-content/block/base/authored.base.block.types";
import type { AuthoredArticleSectionHeadingBlock } from "@shared-types/page-content/block/article-section/authored.article-section.block.types";

export type ImageStripSource = "homepage-strip";
export type ImageStripStrategy = "dailyRandom";

export type AuthoredImageStripBlock = AuthoredBaseBlock<
  "imageStrip",
  {
    heading: AuthoredArticleSectionHeadingBlock;
    source: ImageStripSource;
    strategy?: ImageStripStrategy;
    itemCount?: number;
    excludePagePhotos?: boolean;
  }
>;
