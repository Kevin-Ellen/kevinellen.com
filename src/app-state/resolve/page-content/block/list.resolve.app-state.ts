// src/app-state/resolve/page-content/block/list.resolve.app-state.ts

import type {
  AuthoredListItemBlockContentModule,
  AuthoredListBlockContentModule,
} from "@shared-types/page-content/block/list/authored.list.block.page-content.types";
import type {
  AppStateListItemBlockContentModule,
  AppStateListBlockContentModule,
} from "@shared-types/page-content/block/list/app-state.list.block.page-content.types";

import { appStateResolveInlineContent } from "@app-state/resolve/page-content/inline/inline.page-content.resolve.app-state";

export const appStateResolveListItemBlockContentModule = (
  item: AuthoredListItemBlockContentModule,
): AppStateListItemBlockContentModule => {
  return {
    ...item,
    content: item.content.map(appStateResolveInlineContent),
  };
};

export const appStateResolveListBlockContentModule = (
  module: AuthoredListBlockContentModule,
): AppStateListBlockContentModule => {
  return {
    ...module,
    style: module.style ?? "unordered",
    items: module.items.map(appStateResolveListItemBlockContentModule),
  };
};
