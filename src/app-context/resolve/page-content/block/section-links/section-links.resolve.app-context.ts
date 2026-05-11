// src/app-context/resolve/page-content/block/section-links/section-links.resolve.app-context.ts

import type { AppStateSectionLinksBlock } from "@shared-types/page-content/block/section-links/app-state.section-links.block.types";
import type { AppContextSectionLinksBlock } from "@shared-types/page-content/block/section-links/app-context.section-links.block.types";
import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

export const appContextResolveSectionLinksBlock = (
  module: AppStateSectionLinksBlock,
  context: AppContextPageContentResolverContext,
): AppContextSectionLinksBlock => ({
  ...module,
  sections: module.sections.map((section) => ({
    ...section,
    link: context.resolveInternalLink(section.link),
  })),
});
