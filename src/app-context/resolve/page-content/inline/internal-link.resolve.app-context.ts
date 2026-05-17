// src/app-context/resolve/page-content/inline/internal-link.resolve.app-context.ts

import type { AppStateInternalLinkInline } from "@shared-types/page-content/inline/internal-link/app-state.internal-link.inline-content.types";
import type { AppContextInternalLinkInline } from "@shared-types/page-content/inline/internal-link/app-context.internal-link.inline-content.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

export const appContextResolveInternalLinkInline = (
  content: AppStateInternalLinkInline,
  context: AppContextPageContentResolverContext,
): AppContextInternalLinkInline => {
  return {
    ...content,
    link: context.resolveInternalLink(content.link),
  };
};
