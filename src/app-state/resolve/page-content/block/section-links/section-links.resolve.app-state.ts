// src/app-state/resolve/page-content/block/section-links/section-links.resolve.app-state.ts

import type { AuthoredSectionLinksBlock } from "@shared-types/page-content/block/section-links/authored.section-links.block.types";
import type { AppStateSectionLinksBlock } from "@shared-types/page-content/block/section-links/app-state.section-links.block.types";

import { appStateResolveInternalLink } from "@app-state/resolve/links/internal.link.resolve.app-state";

export const appStateResolveSectionLinksBlock = (
  module: AuthoredSectionLinksBlock,
): AppStateSectionLinksBlock => ({
  ...module,
  flow: "content",
  sections: module.sections.map((section) => ({
    ...section,
    intro: section.intro ?? null,
    link: appStateResolveInternalLink(section.link),
  })),
});
