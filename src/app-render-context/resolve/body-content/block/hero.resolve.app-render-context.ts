// src/app-render-context/resolve/body-content/block/hero.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextHeroBlockContentModule } from "@shared-types/page-content/block/hero/app-context.hero.block.page-content.types";
import type { AppRenderContextHeroBlockContentModule } from "@shared-types/page-content/block/hero/app-render-context.hero.block.page-content.types";

export const resolveHeroBlockContentModuleAppRenderContext = (
  _appContext: AppContext,
  module: AppContextHeroBlockContentModule,
): AppRenderContextHeroBlockContentModule => {
  return module;
};
