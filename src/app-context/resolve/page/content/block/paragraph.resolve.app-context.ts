// src/app-context/resolve/page/content/block/paragraph.resolve.app-context.ts

import type { AppStateParagraphBlockContentModule } from "@shared-types/page-content/block/paragraph/app-state.paragraph.block.page-content.types";
import type { AppContextParagraphBlockContentModule } from "@shared-types/page-content/block/paragraph/app-context.paragraph.block.page-content.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

import { appContextResolveInlineContent } from "@app-context/resolve/page/content/inline/inline.page-content.resolve.app-context";

export const appContextResolveParagraphBlockContentModule = (
  module: AppStateParagraphBlockContentModule,
  context: AppContextPageContentResolverContext,
): AppContextParagraphBlockContentModule => {
  return {
    ...module,
    content: module.content.map((content) =>
      appContextResolveInlineContent(content, context),
    ),
  };
};
