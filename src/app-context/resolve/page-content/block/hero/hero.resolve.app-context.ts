// src/app-context/resolve/page-content/block/hero/hero.resolve.app-context.ts

import type { AppStateHeroBlock } from "@shared-types/page-content/block/hero/app-state.hero.block.types";
import type { AppContextHeroBlock } from "@shared-types/page-content/block/hero/app-context.hero.block.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

export const appContextResolveHeroBlock = (
  module: AppStateHeroBlock,
  context: AppContextPageContentResolverContext,
): AppContextHeroBlock => {
  const photo = context.resolvePhoto(module.photoId);

  if (!photo) {
    throw new Error(
      `No AppContext photo resolved for hero photoId: ${module.photoId}`,
    );
  }

  return {
    ...module,
    photo,
  };
};
