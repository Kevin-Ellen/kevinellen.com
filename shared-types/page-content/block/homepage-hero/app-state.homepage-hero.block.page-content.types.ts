// shared-types/page-content/block/homepage-hero/app-state.homepage-hero.block.page-content.types.ts

import type { BlockContentModuleFlow } from "@shared-types/page-content/block/shared.block.content.types";
import type { AuthoredHomepageHeroBlockContentModule } from "@shared-types/page-content/block/homepage-hero/authored.homepage-hero.block.page-content.types";
import type { AppStateInlineContent } from "@shared-types/page-content/inline/app-state.inline-content.page-content.types";
import type { AppStateInternalLink } from "@shared-types/links/app-state.links.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppStateHomepageHeroBlockContentModuleDeterministicFields = Readonly<{
  eyebrow: string | null;
  intro: AppStateInlineContent[];
  primaryLink: AppStateInternalLink | null;
  flow: Extract<BlockContentModuleFlow, "breakout">;
}>;

export type AppStateHomepageHeroBlockContentModule = Replace<
  AuthoredHomepageHeroBlockContentModule,
  AppStateHomepageHeroBlockContentModuleDeterministicFields
>;
