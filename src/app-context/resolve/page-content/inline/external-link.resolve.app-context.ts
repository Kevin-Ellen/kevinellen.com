// src/app-context/resolve/page-content/inline/external-link.resolve.app-context.ts

import type { AppStateExternalLinkInline } from "@shared-types/page-content/inline/external-link/app-state.external-link.inline-content.types";
import type { AppContextExternalLinkInline } from "@shared-types/page-content/inline/external-link/app-context.external-link.inline-content.types";

export const appContextResolveExternalLinkInline = (
  content: AppStateExternalLinkInline,
): AppContextExternalLinkInline => {
  return content;
};
