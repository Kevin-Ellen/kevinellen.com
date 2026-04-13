// src/app-state/resolve/page-content/inline/external-link.resolve.app-state.ts

import type { AuthoredExternalLinkInlineContent } from "@shared-types/page-content/inline/external-link/authored.external-link.inline-content.page-content.types";
import type { AppStateExternalLinkInlineContent } from "@shared-types/page-content/inline/external-link/app-state.external-link.inline-content.page-content.types";

import { appStateResolveExternalLink } from "@app-state/resolve/links/external-link.resolve.app-state";

export const appStateResolveExternalLinkInlineContent = (
  content: AuthoredExternalLinkInlineContent,
): AppStateExternalLinkInlineContent => {
  return {
    ...content,
    link: appStateResolveExternalLink(content.link),
  };
};
