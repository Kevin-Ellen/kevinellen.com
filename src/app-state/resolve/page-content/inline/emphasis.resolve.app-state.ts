// src/app-state/resolve/page-content/inline/emphasis.resolve.app-state.ts

import type { AuthoredEmphasisInline } from "@shared-types/page-content/inline/emphasis/authored.emphasis.inline-content.types";
import type { AppStateEmphasisInline } from "@shared-types/page-content/inline/emphasis/app-state.emphasis.inline-content.types";

import { appStateResolveInline } from "@app-state/resolve/page-content/inline/inline.page-content.resolve.app-state";

export const appStateResolveEmphasisInline = (
  content: AuthoredEmphasisInline,
): AppStateEmphasisInline => {
  return {
    ...content,
    content: content.content.map(appStateResolveInline),
  };
};
