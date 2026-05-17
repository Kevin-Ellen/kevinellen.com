// src/app-context/resolve/page-content/inline/emphasis.resolve.app-context.ts

import type { AppStateEmphasisInline } from "@shared-types/page-content/inline/emphasis/app-state.emphasis.inline-content.types";
import type { AppContextEmphasisInline } from "@shared-types/page-content/inline/emphasis/app-context.emphasis.inline-content.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

import { appContextResolveInline } from "@app-context/resolve/page-content/inline/inline.resolve.app-context";

export const appContextResolveEmphasisInline = (
  content: AppStateEmphasisInline,
  context: AppContextPageContentResolverContext,
): AppContextEmphasisInline => {
  return {
    ...content,
    content: content.content.map((item) =>
      appContextResolveInline(item, context),
    ),
  };
};
