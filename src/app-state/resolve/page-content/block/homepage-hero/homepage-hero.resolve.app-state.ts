// src/app-state/resolve/page-content/block/homepage-hero/homepage-hero.resolve.app-state.ts

import type { AuthoredHomepageHeroBlock } from "@shared-types/page-content/block/homepage-hero/authored.homepage-hero.block.types";
import type { AppStateHomepageHeroBlock } from "@shared-types/page-content/block/homepage-hero/app-state.homepage-hero.block.types";

import { appStateResolveInline } from "@app-state/resolve/page-content/inline/inline.page-content.resolve.app-state";
import { appStateResolveInternalLink } from "@app-state/resolve/links/internal.link.resolve.app-state";

export const appStateResolveHomepageHeroBlock = (
  module: AuthoredHomepageHeroBlock,
): AppStateHomepageHeroBlock => {
  return {
    kind: "homepageHero",
    flow: "breakout",
    eyebrow: module.eyebrow ?? null,
    title: module.title,
    intro: (module.intro ?? []).map(appStateResolveInline),
    photoId: module.photoId,
    primaryLink: module.primaryLink
      ? appStateResolveInternalLink(module.primaryLink)
      : null,
  };
};
