// shared-types/page-content/block/section-links/app-state.section-links.block.page-content.types.ts

import type { AuthoredSectionLinksBlockContentModule } from "@shared-types/page-content/block/section-links/authored.section-links.block.page-content.types";
import type { AppStateInternalLink } from "@shared-types/links/app-state.links.types";
import type { BlockContentModuleFlow } from "@shared-types/page-content/block/shared.block.content.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppStateSectionLinksSection = Replace<
  AuthoredSectionLinksBlockContentModule["sections"][number],
  {
    link: AppStateInternalLink;
  }
>;

type AppStateSectionLinksBlockContentModuleDeterministicFields = Readonly<{
  flow: Extract<BlockContentModuleFlow, "content">;
  sections: readonly AppStateSectionLinksSection[];
}>;

export type AppStateSectionLinksBlockContentModule = Replace<
  AuthoredSectionLinksBlockContentModule,
  AppStateSectionLinksBlockContentModuleDeterministicFields
>;
