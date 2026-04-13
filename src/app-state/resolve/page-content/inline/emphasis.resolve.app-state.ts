// src/app-state/resolve/page-content/inline/emphasis.resolve.app-state.ts

import type { AuthoredEmphasisInlineContent } from "@shared-types/page-content/inline/emphasis/authored.emphasis.inline-content.page-content.types";
import type { AppStateEmphasisInlineContent } from "@shared-types/page-content/inline/emphasis/app-state.emphasis.inline-content.page-content.types";

import { appStateResolveInlineContent } from "./inline.page-content.resolve.app-state";

export const appStateResolveEmphasisInlineContent = (
  content: AuthoredEmphasisInlineContent,
): AppStateEmphasisInlineContent => {
  return {
    ...content,
    content: content.content.map(appStateResolveInlineContent),
  };
};
