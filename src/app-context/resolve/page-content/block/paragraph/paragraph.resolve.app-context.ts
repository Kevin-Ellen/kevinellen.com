// src/app-context/resolve/page-content/block/paragraph/paragraph.resolve.app-context.ts

import type { AppStateParagraphBlock } from "@shared-types/page-content/block/paragraph/app-state.paragraph.block.types";
import type { AppContextParagraphBlock } from "@shared-types/page-content/block/paragraph/app-context.paragraph.block.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

import { appContextResolveInline } from "@app-context/resolve/page-content/inline/inline.resolve.app-context";

export const appContextResolveParagraphBlock = (
  module: AppStateParagraphBlock,
  context: AppContextPageContentResolverContext,
): AppContextParagraphBlock => {
  return {
    ...module,
    content: module.content.map((content) =>
      appContextResolveInline(content, context),
    ),
  };
};
