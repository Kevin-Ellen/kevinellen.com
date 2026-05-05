// src/app-state/resolve/page-content/block/homepage-hero.resolve.app-state.ts

import type { AuthoredHomepageHeroBlockContentModule } from "@shared-types/page-content/block/homepage-hero/authored.homepage-hero.block.page-content.types";
import type { AppStateHomepageHeroBlockContentModule } from "@shared-types/page-content/block/homepage-hero/app-state.homepage-hero.block.page-content.types";

import { appStateResolveInlineContent } from "@app-state/resolve/page-content/inline/inline.page-content.resolve.app-state";
import { appStateResolveInternalLink } from "@app-state/resolve/links/internal.link.resolve.app-state";

export const appStateResolveHomepageHeroBlockContentModule = (
  module: AuthoredHomepageHeroBlockContentModule,
): AppStateHomepageHeroBlockContentModule => {
  return {
    kind: "homepageHero",
    flow: "breakout",
    eyebrow: module.eyebrow ?? null,
    title: module.title,
    intro: (module.intro ?? []).map(appStateResolveInlineContent),
    photoId: module.photoId,
    primaryLink: module.primaryLink
      ? appStateResolveInternalLink(module.primaryLink)
      : null,
  };
};
