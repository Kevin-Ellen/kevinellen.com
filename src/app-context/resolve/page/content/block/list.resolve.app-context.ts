// src/app-context/resolve/page/content/block/list.resolve.app-context.ts

import type {
  AppStateListItemBlockContentModule,
  AppStateListBlockContentModule,
} from "@shared-types/page-content/block/list/app-state.list.block.page-content.types";
import type {
  AppContextListItemBlockContentModule,
  AppContextListBlockContentModule,
} from "@shared-types/page-content/block/list/app-context.list.block.page-content.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

import { appContextResolveInlineContent } from "@app-context/resolve/page/content/inline/inline.page-content.resolve.app-context";

const appContextResolveListItemBlockContentModule = (
  item: AppStateListItemBlockContentModule,
  context: AppContextPageContentResolverContext,
): AppContextListItemBlockContentModule => {
  return {
    ...item,
    content: item.content.map((content) =>
      appContextResolveInlineContent(content, context),
    ),
  };
};

export const appContextResolveListBlockContentModule = (
  module: AppStateListBlockContentModule,
  context: AppContextPageContentResolverContext,
): AppContextListBlockContentModule => {
  return {
    ...module,
    items: module.items.map((item) =>
      appContextResolveListItemBlockContentModule(item, context),
    ),
  };
};
