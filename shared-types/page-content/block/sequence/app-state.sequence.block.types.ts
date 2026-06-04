// shared-types/page-content/block/sequence/app-state.sequence.block.types.ts

import type { AuthoredSequenceBlock } from "@shared-types/page-content/block/sequence/authored.sequence.block.types";
import type { BlockFlow } from "@shared-types/page-content/block/shared.block.types";
import type { AppStateInline } from "@shared-types/page-content/inline/app-state.inline-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type DeterministicFields = Readonly<{
  immersive: boolean;
  flow: BlockFlow;
  caption: readonly AppStateInline[];
}>;

export type AppStateSequenceBlock = Replace<
  AuthoredSequenceBlock,
  DeterministicFields
>;
