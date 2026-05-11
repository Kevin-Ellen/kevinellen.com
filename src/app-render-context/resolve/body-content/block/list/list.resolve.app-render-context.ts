// src/app-render-context/resolve/body-content/block/list/list.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextListBlock } from "@shared-types/page-content/block/list/app-context.list.block.types";
import type { AppRenderContextListBlock } from "@shared-types/page-content/block/list/app-render-context.list.block.types";

import { appRenderContextResolveInline } from "@app-render-context/resolve/body-content/inline/inline.resolve.app-render-context";

export const appRenderContextResolveListBlock = (
  appContext: AppContext,
  block: AppContextListBlock,
): AppRenderContextListBlock => ({
  ...block,
  items: block.items.map((item) => ({
    ...item,
    content: item.content.map((inlineItem) =>
      appRenderContextResolveInline(appContext, inlineItem),
    ),
  })),
});
