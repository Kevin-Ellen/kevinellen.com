// src/app-context/resolve/page/content/inline/emphasis.resolve.app-context.ts

import type { AppStateEmphasisInlineContent } from "@shared-types/page-content/inline/emphasis/app-state.emphasis.inline-content.page-content.types";
import type { AppContextEmphasisInlineContent } from "@shared-types/page-content/inline/emphasis/app-context.emphasis.inline-content.page-content.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

import { appContextResolveInlineContent } from "@app-context/resolve/page/content/inline/inline.page-content.resolve.app-context";

export const appContextResolveEmphasisInlineContent = (
  content: AppStateEmphasisInlineContent,
  context: AppContextPageContentResolverContext,
): AppContextEmphasisInlineContent => {
  return {
    ...content,
    content: content.content.map((item) =>
      appContextResolveInlineContent(item, context),
    ),
  };
};
