// src/app-context/resolve/page/content/block/hero.resolve.app-context.ts

import type { AppStateHeroBlockContentModule } from "@shared-types/page-content/block/hero/app-state.hero.block.page-content.types";
import type { AppContextHeroBlockContentModule } from "@shared-types/page-content/block/hero/app-context.hero.block.page-content.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

export const appContextResolveHeroBlockContentModule = (
  module: AppStateHeroBlockContentModule,
  _context: AppContextPageContentResolverContext,
): AppContextHeroBlockContentModule => {
  return module;
};
