// src/app-context/resolve/page/content/inline/external-link.resolve.app-context.ts

import type { AppStateExternalLinkInlineContent } from "@shared-types/page-content/inline/external-link/app-state.external-link.inline-content.page-content.types";
import type { AppContextExternalLinkInlineContent } from "@shared-types/page-content/inline/external-link/app-context.external-link.inline-content.page-content.types";

export const appContextResolveExternalLinkInlineContent = (
  content: AppStateExternalLinkInlineContent,
): AppContextExternalLinkInlineContent => {
  return {
    ...content,
    link: content.link,
  };
};
