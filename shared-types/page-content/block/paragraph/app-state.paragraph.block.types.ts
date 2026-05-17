// shared-types/page-content/block/paragraph/app-state.paragraph.block.types.ts

import type { BlockFlow } from "@shared-types/page-content/block/shared.block.types";
import type { AuthoredParagraphBlock } from "@shared-types/page-content/block/paragraph/authored.paragraph.block.types";
import type { AppStateInline } from "@shared-types/page-content/inline/app-state.inline-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type DeterministicFields = Readonly<{
  flow: BlockFlow;
  content: readonly AppStateInline[];
}>;

export type AppStateParagraphBlock = Replace<
  AuthoredParagraphBlock,
  DeterministicFields
>;
