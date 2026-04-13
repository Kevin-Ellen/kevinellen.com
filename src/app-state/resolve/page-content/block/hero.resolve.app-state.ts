// src/app-state/resolve/page-content/block/hero.resolve.app-state.ts

import type { AuthoredHeroBlockContentModule } from "@shared-types/page-content/block/hero/authored.hero.block.page-content.types";
import type { AppStateHeroBlockContentModule } from "@shared-types/page-content/block/hero/app-state.hero.block.page-content.types";

export const appStateResolveHeroBlockContentModule = (
  module: AuthoredHeroBlockContentModule,
): AppStateHeroBlockContentModule => {
  return {
    ...module,
    immersive: module.immersive ?? false,
    flow: module.flow ?? "content",
  };
};
