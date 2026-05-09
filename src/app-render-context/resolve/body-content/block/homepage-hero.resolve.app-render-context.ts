// src/app-render-context/resolve/body-content/block/homepage-hero.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextHomepageHeroBlockContentModule } from "@shared-types/page-content/block/homepage-hero/app-context.homepage-hero.block.types";
import type { AppRenderContextHomepageHeroBlockContentModule } from "@shared-types/page-content/block/homepage-hero/app-render-context.homepage-hero.block.types";

import { resolveInlineContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/inline/inline.resolve.app-render-context";
import { resolvePhotoAppRenderContext } from "@app-render-context/resolve/media/photo.resolve.app-render-context";
import { resolveLinkAppRenderContext } from "@app-render-context/shared/link.resolve.app-render-context";

export const resolveHomepageHeroAppRenderContext = (
  appContext: AppContext,
  module: AppContextHomepageHeroBlockContentModule,
): AppRenderContextHomepageHeroBlockContentModule => {
  const photo = resolvePhotoAppRenderContext(
    module.photo,
    appContext.metadataLabels,
  );

  return {
    kind: "homepageHero",
    flow: module.flow,
    eyebrow: module.eyebrow,
    title: module.title,
    intro: module.intro.map((content) =>
      resolveInlineContentModuleAppRenderContext(appContext, content),
    ),
    photo: {
      src: photo.src,
      srcset: photo.srcset,
      sizes: photo.sizes,
      alt: photo.alt,
      width: photo.width,
      height: photo.height,
      ratio: photo.ratio,
    },
    primaryLink: module.primaryLink
      ? resolveLinkAppRenderContext(appContext, module.primaryLink)
      : null,
  };
};
