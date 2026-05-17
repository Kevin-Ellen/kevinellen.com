// shared-types/page-content/block/list/app-state.list.block.types.ts

import type {
  BlockFlow,
  BlockListStyle,
} from "@shared-types/page-content/block/shared.block.types";
import type {
  AuthoredListItemBlock,
  AuthoredListBlock,
} from "@shared-types/page-content/block/list/authored.list.block.types";
import type { AppStateInline } from "@shared-types/page-content/inline/app-state.inline-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type ItemDeterministicFields = Readonly<{
  content: readonly AppStateInline[];
}>;

export type AppStateListItemBlock = Replace<
  AuthoredListItemBlock,
  ItemDeterministicFields
>;

type DeterministicFields = Readonly<{
  style: BlockListStyle;
  flow: BlockFlow;
  items: readonly AppStateListItemBlock[];
}>;

export type AppStateListBlock = Replace<AuthoredListBlock, DeterministicFields>;
