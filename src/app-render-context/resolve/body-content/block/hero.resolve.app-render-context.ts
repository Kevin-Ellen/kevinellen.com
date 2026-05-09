// src/app-render-context/resolve/body-content/block/hero.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextHeroBlock } from "@shared-types/page-content/block/hero/app-context.hero.block.types";
import type { AppRenderContextHeroBlock } from "@shared-types/page-content/block/hero/app-render-context.hero.block.types";

import { appRenderContextResolvePhoto } from "@app-render-context/resolve/media/photo.resolve.app-render-context";

export const appRenderContextResolveHeroBlock = (
  appContext: AppContext,
  block: AppContextHeroBlock,
): AppRenderContextHeroBlock => {
  return {
    kind: block.kind,
    immersive: block.immersive,
    flow: block.flow,
    photo: appRenderContextResolvePhoto(block.photo, appContext.metadataLabels),
  };
};
