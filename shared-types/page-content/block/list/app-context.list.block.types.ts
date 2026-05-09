// shared-types/page-content/block/list/app-context.list.block.types.ts

import type {
  AppStateListItemBlock,
  AppStateListBlock,
} from "@shared-types/page-content/block/list/app-state.list.block.types";
import type { AppContextInline } from "@shared-types/page-content/inline/app-context.inline-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type ItemRuntimeFields = Readonly<{
  content: readonly AppContextInline[];
}>;

export type AppContextListItemBlock = Replace<
  AppStateListItemBlock,
  ItemRuntimeFields
>;

type RuntimeFields = Readonly<{
  items: readonly AppContextListItemBlock[];
}>;

export type AppContextListBlock = Replace<AppStateListBlock, RuntimeFields>;
