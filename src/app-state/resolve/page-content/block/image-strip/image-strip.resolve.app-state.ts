// src/app-state/resolve/page-content/block/image-strip/image-strip.resolve.app-state.ts

import type { AuthoredImageStripBlock } from "@shared-types/page-content/block/image-strip/authored.image-strip.block.types";
import type { AppStateImageStripBlock } from "@shared-types/page-content/block/image-strip/app-state.image-strip.block.types";

import { appStateResolveArticleSectionHeadingBlock } from "@app-state/resolve/page-content/block/article-section/article-section.resolve.app-state";

export const appStateResolveImageStripBlock = (
  module: AuthoredImageStripBlock,
): AppStateImageStripBlock => {
  return {
    ...module,
    kind: "imageStrip",
    heading: appStateResolveArticleSectionHeadingBlock(module.heading),
    flow: module.flow ?? "breakout",
    source: module.source,
    strategy: module.strategy ?? "dailyRandom",
    itemCount: module.itemCount ?? 5,
    excludePagePhotos: module.excludePagePhotos ?? true,
  };
};
