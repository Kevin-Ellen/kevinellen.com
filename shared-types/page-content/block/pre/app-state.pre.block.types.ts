// shared-types/page-content/block/pre/app-state.pre.block.types.ts

import type { BlockFlow } from "@shared-types/page-content/block/shared.block.types";
import type { AuthoredPreBlock } from "@shared-types/page-content/block/pre/authored.pre.block.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type DeterministicFields = Readonly<{
  flow: BlockFlow;
}>;

export type AppStatePreBlock = Replace<AuthoredPreBlock, DeterministicFields>;
