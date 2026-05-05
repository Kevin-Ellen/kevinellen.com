// src/app-state/resolve/page-content/block/section-links.resolve.app-state.ts

import type { AuthoredSectionLinksBlockContentModule } from "@shared-types/page-content/block/section-links/authored.section-links.block.page-content.types";
import type { AppStateSectionLinksBlockContentModule } from "@shared-types/page-content/block/section-links/app-state.section-links.block.page-content.types";

export const appStateResolveSectionLinksBlockContentModule = (
  module: AuthoredSectionLinksBlockContentModule,
): AppStateSectionLinksBlockContentModule => ({
  ...module,
  flow: "content",
  sections: module.sections.map((section) => ({
    ...section,
    intro: section.intro ?? null,
    link: {
      ...section.link,
      text: section.link.text ?? null,
      svgId: section.link.svgId ?? null,
      behaviour: section.link.behaviour ?? {
        openInNewTab: false,
      },
    },
  })),
});
