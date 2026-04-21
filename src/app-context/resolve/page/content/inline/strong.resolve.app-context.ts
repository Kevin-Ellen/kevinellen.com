// src/app-context/resolve/page/content/inline/strong.resolve.app-context.ts

import type { AppStateStrongInlineContent } from "@shared-types/page-content/inline/strong/app-state.strong.inline-content.page-content.types";
import type { AppContextStrongInlineContent } from "@shared-types/page-content/inline/strong/app-context.strong.inline-content.page-content.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

import { appContextResolveInlineContent } from "@app-context/resolve/page/content/inline/inline.page-content.resolve.app-context";

export const appContextResolveStrongInlineContent = (
  content: AppStateStrongInlineContent,
  context: AppContextPageContentResolverContext,
): AppContextStrongInlineContent => {
  return {
    ...content,
    content: content.content.map((item) =>
      appContextResolveInlineContent(item, context),
    ),
  };
};
