// src/app-context/resolve/page-content/inline/strong.resolve.app-context.ts

import type { AppStateStrongInline } from "@shared-types/page-content/inline/strong/app-state.strong.inline-content.types";
import type { AppContextStrongInline } from "@shared-types/page-content/inline/strong/app-context.strong.inline-content.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

import { appContextResolveInline } from "@app-context/resolve/page-content/inline/inline.resolve.app-context";

export const appContextResolveStrongInline = (
  content: AppStateStrongInline,
  context: AppContextPageContentResolverContext,
): AppContextStrongInline => {
  return {
    ...content,
    content: content.content.map((item) =>
      appContextResolveInline(item, context),
    ),
  };
};
