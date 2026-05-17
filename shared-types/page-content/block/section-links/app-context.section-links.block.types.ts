// shared-types/page-content/block/section-links/app-context.section-links.block.types.ts

import type { AppStateSectionLinksBlock } from "@shared-types/page-content/block/section-links/app-state.section-links.block.types";
import type { AppContextInternalLink } from "@shared-types/links/app-context.links.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type SectionLinksSection = Replace<
  AppStateSectionLinksBlock["sections"][number],
  {
    link: AppContextInternalLink;
  }
>;

type ResolvedFields = Readonly<{
  sections: readonly SectionLinksSection[];
}>;

export type AppContextSectionLinksBlock = Replace<
  AppStateSectionLinksBlock,
  ResolvedFields
>;
