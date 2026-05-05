// shared-types/page-content/block/image-strip/authored.image-strip.block.page-content.types.ts

import type { AuthoredBaseBlockContentModule } from "@shared-types/page-content/block/base/authored.base.block.page-content.types";
import type { AuthoredArticleSectionBlockContentModule } from "@shared-types/page-content/block/article-section/authored.article-section.block.page-content.types";

export type ImageStripSource = "homepage-strip";
export type ImageStripStrategy = "dailyRandom";

export type AuthoredImageStripBlockContentModule =
  AuthoredBaseBlockContentModule<
    "imageStrip",
    {
      heading: AuthoredArticleSectionBlockContentModule["heading"];
      source: ImageStripSource;
      strategy?: ImageStripStrategy;
      itemCount?: number;
      excludePagePhotos?: boolean;
    }
  >;
