// src/app-state/resolve/page-content/inline/external-link.resolve.app-state.ts

import type { AuthoredExternalLinkInline } from "@shared-types/page-content/inline/external-link/authored.external-link.inline-content.types";
import type { AppStateExternalLinkInline } from "@shared-types/page-content/inline/external-link/app-state.external-link.inline-content.types";

import { appStateResolveExternalLink } from "@app-state/resolve/links/external.link.resolve.app-state";

export const appStateResolveExternalLinkInline = (
  content: AuthoredExternalLinkInline,
): AppStateExternalLinkInline => {
  return {
    ...content,
    link: appStateResolveExternalLink(content.link),
  };
};
