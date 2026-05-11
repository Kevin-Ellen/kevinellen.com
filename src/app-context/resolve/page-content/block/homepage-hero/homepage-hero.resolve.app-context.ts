// src/app-context/resolve/page-content/block/homepage-hero/homepage-hero.resolve.app-context.ts

import type { AppStateHomepageHeroBlock } from "@shared-types/page-content/block/homepage-hero/app-state.homepage-hero.block.types";
import type { AppContextHomepageHeroBlock } from "@shared-types/page-content/block/homepage-hero/app-context.homepage-hero.block.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

import { appContextResolveInline } from "@app-context/resolve/page-content/inline/inline.resolve.app-context";

export const appContextResolveHomepageHero = (
  module: AppStateHomepageHeroBlock,
  context: AppContextPageContentResolverContext,
): AppContextHomepageHeroBlock => {
  const photo = context.photos.find(
    (candidate) => candidate.id === module.photoId,
  );

  if (!photo) {
    throw new Error(
      `No AppContext photo resolved for homepage hero photoId: ${module.photoId}`,
    );
  }

  return {
    kind: "homepageHero",
    flow: module.flow,
    eyebrow: module.eyebrow,
    title: module.title,
    intro: module.intro.map((content) =>
      appContextResolveInline(content, context),
    ),
    photo,
    primaryLink: module.primaryLink
      ? context.resolveInternalLink(module.primaryLink)
      : null,
  };
};
