// src/app-context/resolve/page/content/block/homepage-hero.resolve.app-context.ts

import type { AppStateHomepageHeroBlockContentModule } from "@shared-types/page-content/block/homepage-hero/app-state.homepage-hero.block.page-content.types";
import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppContextHomepageHeroBlockContentModule } from "@shared-types/page-content/block/homepage-hero/app-context.homepage-hero.block.page-content.types";

import { appContextResolveInlineContent } from "@app-context/resolve/page/content/inline/inline.page-content.resolve.app-context";

export const appContextResolveHomepageHeroContentModule = (
  module: AppStateHomepageHeroBlockContentModule,
  context: AppContextPageContentResolverContext,
): AppContextHomepageHeroBlockContentModule => {
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
      appContextResolveInlineContent(content, context),
    ),
    photo,
    primaryLink: module.primaryLink
      ? context.resolveInternalLink(module.primaryLink)
      : null,
  };
};
