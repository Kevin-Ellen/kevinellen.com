// src/app-state/resolve/page-content/block/image-strip.resolve.app-state.ts

import type { AuthoredImageStripBlockContentModule } from "@shared-types/page-content/block/image-strip/authored.image-strip.block.page-content.types";
import type { AppStateImageStripBlockContentModule } from "@shared-types/page-content/block/image-strip/app-state.image-strip.block.page-content.types";

export const appStateResolveImageStripBlockContentModule = (
  module: AuthoredImageStripBlockContentModule,
): AppStateImageStripBlockContentModule => {
  return {
    ...module,
    kind: "imageStrip",
    flow: module.flow ?? "breakout",
    source: module.source,
    strategy: module.strategy ?? "dailyRandom",
    itemCount: module.itemCount ?? 5,
    excludePagePhotos: module.excludePagePhotos ?? true,
  };
};
