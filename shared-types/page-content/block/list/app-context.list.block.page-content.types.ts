// shared-types/page-content/block/list/app-context.list.block.page-content.types.ts

import type {
  AppStateListItemBlockContentModule,
  AppStateListBlockContentModule,
} from "@shared-types/page-content/block/list/app-state.list.block.page-content.types";
import type { AppContextInlineContent } from "@shared-types/page-content/inline/app-context.inline-content.page-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppContextListItemBlockContentModuleRuntimeFields = Readonly<{
  content: readonly AppContextInlineContent[];
}>;

export type AppContextListItemBlockContentModule = Replace<
  AppStateListItemBlockContentModule,
  AppContextListItemBlockContentModuleRuntimeFields
>;

type AppContextListBlockContentModuleRuntimeFields = Readonly<{
  items: readonly AppContextListItemBlockContentModule[];
}>;

export type AppContextListBlockContentModule = Replace<
  AppStateListBlockContentModule,
  AppContextListBlockContentModuleRuntimeFields
>;
