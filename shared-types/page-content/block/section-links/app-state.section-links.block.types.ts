// shared-types/page-content/block/section-links/app-state.section-links.block.types.ts

import type { AuthoredSectionLinksBlock } from "@shared-types/page-content/block/section-links/authored.section-links.block.types";
import type { AppStateInternalLink } from "@shared-types/links/app-state.links.types";
import type { BlockFlow } from "@shared-types/page-content/block/shared.block.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type SectionLinksSection = Replace<
  AuthoredSectionLinksBlock["sections"][number],
  {
    link: AppStateInternalLink;
  }
>;

type DeterministicFields = Readonly<{
  flow: Extract<BlockFlow, "content">;
  sections: readonly SectionLinksSection[];
}>;

export type AppStateSectionLinksBlock = Replace<
  AuthoredSectionLinksBlock,
  DeterministicFields
>;
