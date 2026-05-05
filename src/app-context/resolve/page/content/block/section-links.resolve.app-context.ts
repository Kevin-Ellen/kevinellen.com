// src/app-context/resolve/page/content/block/section-links.resolve.app-context.ts

import type { AppStateSectionLinksBlockContentModule } from "@shared-types/page-content/block/section-links/app-state.section-links.block.page-content.types";
import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppContextSectionLinksBlockContentModule } from "@shared-types/page-content/block/section-links/app-context.section-links.block.page-content.types";

export const appContextResolveSectionLinksBlockContentModule = (
  module: AppStateSectionLinksBlockContentModule,
  context: AppContextPageContentResolverContext,
): AppContextSectionLinksBlockContentModule => ({
  ...module,
  sections: module.sections.map((section) => ({
    ...section,
    link: context.resolveInternalLink(section.link),
  })),
});
