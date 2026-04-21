// src/app-context/resolve/page/content/inline/internal-link.resolve.app-context.ts

import type { AppStateInternalLinkInlineContent } from "@shared-types/page-content/inline/internal-link/app-state.internal-link.inline-content.page-content.types";
import type { AppContextInternalLinkInlineContent } from "@shared-types/page-content/inline/internal-link/app-context.internal-link.inline-content.page-content.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

export const appContextResolveInternalLinkInlineContent = (
  content: AppStateInternalLinkInlineContent,
  context: AppContextPageContentResolverContext,
): AppContextInternalLinkInlineContent => {
  return {
    ...content,
    link: context.resolveInternalLink(content.link),
  };
};
