// shared-types/page-content/block/homepage-hero/app-state.homepage-hero.block.types.ts

import type { BlockFlow } from "@shared-types/page-content/block/shared.block.types";
import type { AuthoredHomepageHeroBlock } from "@shared-types/page-content/block/homepage-hero/authored.homepage-hero.block.types";
import type { AppStateInline } from "@shared-types/page-content/inline/app-state.inline-content.types";
import type { AppStateInternalLink } from "@shared-types/links/app-state.links.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type DeterministicFields = Readonly<{
  eyebrow: string | null;
  intro: AppStateInline[];
  primaryLink: AppStateInternalLink | null;
  flow: Extract<BlockFlow, "breakout">;
}>;

export type AppStateHomepageHeroBlock = Replace<
  AuthoredHomepageHeroBlock,
  DeterministicFields
>;
