// src/app-state/resolve/page-content/inline/internal-link.resolve.app-state.ts

import type { AuthoredInternalLinkInlineContent } from "@shared-types/page-content/inline/internal-link/authored.internal-link.inline-content.page-content.types";
import type { AppStateInternalLinkInlineContent } from "@shared-types/page-content/inline/internal-link/app-state.internal-link.inline-content.page-content.types";

export const appStateResolveInternalLinkInlineContent = (
  content: AuthoredInternalLinkInlineContent,
): AppStateInternalLinkInlineContent => {
  if (!content.link?.id) {
    throw new Error(`Invalid internal link: missing id in inline content`);
  }

  return {
    ...content,
    link: {
      kind: "internal",
      id: content.link.id,
      svgId: content.link.svgId ?? null,
      behaviour: content.link.behaviour ?? { openInNewTab: false },
    },
  };
};
