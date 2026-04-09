import type { AppContextHeroModule } from "@app/appContext/content/modules/hero/hero.module.appContext.types";
import type { RenderContextHeroModule } from "./hero.module.renderContext.types";

import { normaliseDimensionsToBase } from "@utils/normaliseDimensions.util";

const HERO_IMAGE_BASE = 100;
const HERO_IMAGE_WIDTHS = [480, 768, 1024, 1400] as const;
const HERO_IMAGE_SIZES = "(max-width: 768px) 100vw, 676px";

type HeroImageWidth = (typeof HERO_IMAGE_WIDTHS)[number];

const buildVariantSourceUrl = (
  baseUrl: string,
  width: HeroImageWidth,
): string => {
  return `${baseUrl}${String(width)}w`;
};

const buildSrcSet = (baseUrl: string): string => {
  return HERO_IMAGE_WIDTHS.map(
    (width) => `${buildVariantSourceUrl(baseUrl, width)} ${width}w`,
  ).join(", ");
};

const pickDefaultSrc = (baseUrl: string): string => {
  return buildVariantSourceUrl(baseUrl, 768);
};

export const resolveHeroRenderContext = (
  module: AppContextHeroModule,
): RenderContextHeroModule => {
  const frameBaseUrl = module.photo.image.urls.frame;

  if (!frameBaseUrl) {
    throw new Error(
      `Hero module photo "${module.photo.id}" is missing the "frame" variant URL.`,
    );
  }

  const imageDimensions = normaliseDimensionsToBase(
    module.photo.intrinsic.width,
    module.photo.intrinsic.height,
    HERO_IMAGE_BASE,
  );

  return {
    kind: "hero",
    immersive: module.immersive,
    image: {
      src: pickDefaultSrc(frameBaseUrl),
      srcset: buildSrcSet(frameBaseUrl),
      sizes: HERO_IMAGE_SIZES,
      alt: module.photo.alt,
      width: imageDimensions.width,
      height: imageDimensions.height,
    },
    caption: module.caption,
    meta: module.meta,
    settings: module.settings,
  };
};
