// src/app-render-context/resolve/body-content/block/homepage-hero/homepage-hero.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextHomepageHeroBlock } from "@shared-types/page-content/block/homepage-hero/app-context.homepage-hero.block.types";
import type { AppRenderContextHomepageHeroBlock } from "@shared-types/page-content/block/homepage-hero/app-render-context.homepage-hero.block.types";

import { appRenderContextResolveInline } from "@app-render-context/resolve/body-content/inline/inline.resolve.app-render-context";
import { appRenderContextResolvePhoto } from "@app-render-context/resolve/media/photo.resolve.app-render-context";
import { appRenderContextResolveLink } from "@app-render-context/shared/link.resolve.app-render-context";
import { appRenderContextResolveRenderImage } from "@app-render-context/resolve/media/render-image.resolve.app-render-context";

export const appRenderContextResolveHomepageHeroBlock = (
  appContext: AppContext,
  block: AppContextHomepageHeroBlock,
): AppRenderContextHomepageHeroBlock => {
  const photo = appRenderContextResolvePhoto(
    block.photo,
    appContext.metadataLabels,
  );

  return {
    kind: "homepageHero",
    flow: block.flow,
    eyebrow: block.eyebrow,
    title: block.title,
    intro: block.intro.map((content) =>
      appRenderContextResolveInline(appContext, content),
    ),
    photo: appRenderContextResolveRenderImage(photo),
    primaryLink: block.primaryLink
      ? appRenderContextResolveLink(appContext, block.primaryLink)
      : null,
  };
};
