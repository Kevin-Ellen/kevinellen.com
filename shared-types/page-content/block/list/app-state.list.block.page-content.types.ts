// shared-types/page-content/block/list/app-state.list.block.page-content.types.ts

import type {
  BlockContentModuleFlow,
  BlockContentModuleListStyle,
} from "@shared-types/page-content/block/shared.block.content.types";
import type {
  AuthoredListItemBlockContentModule,
  AuthoredListBlockContentModule,
} from "@shared-types/page-content/block/list/authored.list.block.page-content.types";
import type { AppStateInlineContent } from "@shared-types/page-content/inline/app-state.inline-content.page-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppStateListItemBlockContentModuleDeterministicFields = Readonly<{
  content: readonly AppStateInlineContent[];
}>;

export type AppStateListItemBlockContentModule = Replace<
  AuthoredListItemBlockContentModule,
  AppStateListItemBlockContentModuleDeterministicFields
>;

type AppStateListBlockContentModuleDeterministicFields = Readonly<{
  style: BlockContentModuleListStyle;
  flow: BlockContentModuleFlow;
  items: readonly AppStateListItemBlockContentModule[];
}>;

export type AppStateListBlockContentModule = Replace<
  AuthoredListBlockContentModule,
  AppStateListBlockContentModuleDeterministicFields
>;
