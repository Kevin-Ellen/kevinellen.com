// src/app/renderContext/content/modules/hero/hero.resolve.renderContext.ts

import type { AppContextHeroModule } from "@app/appContext/content/modules/hero/hero.module.appContext.types";
import type { RenderContextHeroModule } from "./hero.module.renderContext.types";

export const resolveHeroRenderContext = (
  module: AppContextHeroModule,
): RenderContextHeroModule => {
  return {
    kind: "hero",
    immersive: module.immersive,
    image: module.image,
    caption: module.caption,
    meta: module.meta,
    settings: module.settings,
  };
};
