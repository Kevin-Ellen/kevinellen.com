// shared-types/page-content/block/pre/app-state.pre.block.types.ts

import type { BlockFlow } from "@shared-types/page-content/block/shared.block.types";
import type { AuthoredPreBlock } from "@shared-types/page-content/block/pre/authored.pre.block.types";
import type { CodeLanguage } from "@shared-types/page-content/shared/code/authored.code.shared.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type DeterministicFields = Readonly<{
  flow: BlockFlow;
  language: CodeLanguage | null;
}>;

export type AppStatePreBlock = Replace<AuthoredPreBlock, DeterministicFields>;
