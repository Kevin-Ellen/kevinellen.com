// shared-types/page-content/block/hero/app-state.hero.block.types.ts

import type { BlockFlow } from "@shared-types/page-content/block/shared.block.types";
import type { AuthoredHeroBlock } from "@shared-types/page-content/block/hero/authored.hero.block.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type DeterministicFields = Readonly<{
  immersive: boolean;
  flow: BlockFlow;
}>;

export type AppStateHeroBlock = Replace<AuthoredHeroBlock, DeterministicFields>;
