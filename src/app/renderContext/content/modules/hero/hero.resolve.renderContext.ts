import type { AppContextHeroModule } from "@app/appContext/content/modules/hero/hero.module.appContext.types";
import type { RenderContextHeroModule } from "./hero.module.renderContext.types";

import { normaliseDimensionsToBase } from "@utils/normaliseDimensions.util";

const HERO_IMAGE_BASE = 100;

export const resolveHeroRenderContext = (
  module: AppContextHeroModule,
): RenderContextHeroModule => {
  const imageDimensions = normaliseDimensionsToBase(
    module.photo.intrinsic.width,
    module.photo.intrinsic.height,
    HERO_IMAGE_BASE,
  );

  return {
    kind: "hero",
    immersive: module.immersive,
    image: {
      src: module.photo.image.urls.frame,
      alt: module.photo.alt,
      width: imageDimensions.width,
      height: imageDimensions.height,
    },
    caption: module.caption,
    meta: module.meta,
    settings: module.settings,
  };
};
