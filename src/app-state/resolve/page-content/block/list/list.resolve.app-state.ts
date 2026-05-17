// src/app-state/resolve/page-content/block/list/list.resolve.app-state.ts

import type {
  AuthoredListItemBlock,
  AuthoredListBlock,
} from "@shared-types/page-content/block/list/authored.list.block.types";
import type {
  AppStateListItemBlock,
  AppStateListBlock,
} from "@shared-types/page-content/block/list/app-state.list.block.types";

import { appStateResolveInline } from "@app-state/resolve/page-content/inline/inline.page-content.resolve.app-state";

export const appStateResolveListItemBlock = (
  item: AuthoredListItemBlock,
): AppStateListItemBlock => {
  return {
    ...item,
    content: item.content.map(appStateResolveInline),
  };
};

export const appStateResolveListBlock = (
  module: AuthoredListBlock,
): AppStateListBlock => {
  return {
    ...module,
    flow: module.flow ?? "content",
    style: module.style ?? "unordered",
    items: module.items.map(appStateResolveListItemBlock),
  };
};
