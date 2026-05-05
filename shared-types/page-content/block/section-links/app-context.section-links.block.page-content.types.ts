// shared-types/page-content/block/section-links/app-context.section-links.block.page-content.types.ts

import type { AppStateSectionLinksBlockContentModule } from "@shared-types/page-content/block/section-links/app-state.section-links.block.page-content.types";
import type { AppContextInternalLink } from "@shared-types/links/app-context.links.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppContextSectionLinksSection = Replace<
  AppStateSectionLinksBlockContentModule["sections"][number],
  {
    link: AppContextInternalLink;
  }
>;

type AppContextSectionLinksBlockContentModuleResolvedFields = Readonly<{
  sections: readonly AppContextSectionLinksSection[];
}>;

export type AppContextSectionLinksBlockContentModule = Replace<
  AppStateSectionLinksBlockContentModule,
  AppContextSectionLinksBlockContentModuleResolvedFields
>;
