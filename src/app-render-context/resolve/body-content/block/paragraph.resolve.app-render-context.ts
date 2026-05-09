// src/app-render-context/resolve/body-content/block/paragraph.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextParagraphBlock } from "@shared-types/page-content/block/paragraph/app-context.paragraph.block.types";
import type { AppRenderContextParagraphBlock } from "@shared-types/page-content/block/paragraph/app-render-context.paragraph.block.types";

import { appRenderContextResolveInline } from "@app-render-context/resolve/body-content/inline/inline.resolve.app-render-context";

export const appRenderContextResolveParagraphBlock = (
  appContext: AppContext,
  module: AppContextParagraphBlock,
): AppRenderContextParagraphBlock => {
  return {
    ...module,
    content: module.content.map((item) =>
      appRenderContextResolveInline(appContext, item),
    ),
  };
};
