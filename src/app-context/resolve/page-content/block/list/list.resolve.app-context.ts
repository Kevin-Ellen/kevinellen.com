// src/app-context/resolve/page-content/block/list/list.resolve.app-context.ts

import type {
  AppStateListItemBlock,
  AppStateListBlock,
} from "@shared-types/page-content/block/list/app-state.list.block.types";
import type {
  AppContextListItemBlock,
  AppContextListBlock,
} from "@shared-types/page-content/block/list/app-context.list.block.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

import { appContextResolveInline } from "@app-context/resolve/page-content/inline/inline.resolve.app-context";

const resolveListItem = (
  item: AppStateListItemBlock,
  context: AppContextPageContentResolverContext,
): AppContextListItemBlock => {
  return {
    ...item,
    content: item.content.map((content) =>
      appContextResolveInline(content, context),
    ),
  };
};

export const appContextResolveListBlock = (
  module: AppStateListBlock,
  context: AppContextPageContentResolverContext,
): AppContextListBlock => {
  return {
    ...module,
    items: module.items.map((item) => resolveListItem(item, context)),
  };
};
