// shared-types/page-content/block/list/app-render-context.list.block.types.ts

import type {
  AppContextListItemBlock,
  AppContextListBlock,
} from "@shared-types/page-content/block/list/app-context.list.block.types";
import type { AppRenderContextInline } from "@shared-types/page-content/inline/app-render-context.inline-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type ItemRuntimeFields = Readonly<{
  content: readonly AppRenderContextInline[];
}>;

export type AppRenderContextListItemBlock = Replace<
  AppContextListItemBlock,
  ItemRuntimeFields
>;

type RuntimeFields = Readonly<{
  items: readonly AppRenderContextListItemBlock[];
}>;

export type AppRenderContextListBlock = Replace<
  AppContextListBlock,
  RuntimeFields
>;
