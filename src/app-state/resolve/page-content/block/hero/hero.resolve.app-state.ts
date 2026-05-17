// src/app-state/resolve/page-content/block/hero.resolve.app-state.ts

import type { AuthoredHeroBlock } from "@shared-types/page-content/block/hero/authored.hero.block.types";
import type { AppStateHeroBlock } from "@shared-types/page-content/block/hero/app-state.hero.block.types";

export const appStateResolveHeroBlock = (
  module: AuthoredHeroBlock,
): AppStateHeroBlock => {
  return {
    ...module,
    immersive: module.immersive ?? false,
    flow: module.flow ?? "content",
  };
};
