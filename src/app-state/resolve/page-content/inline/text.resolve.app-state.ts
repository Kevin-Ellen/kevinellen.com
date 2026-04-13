// src/app-state/resolve/page-content/inline/text.resolve.app-state.ts

import type { AuthoredTextInlineContent } from "@shared-types/page-content/inline/text/authored.text.inline-content.page-content.types";
import type { AppStateTextInlineContent } from "@shared-types/page-content/inline/text/app-state.text.inline-content.page-content.types";

export const appStateResolveTextInlineContent = (
  content: AuthoredTextInlineContent,
): AppStateTextInlineContent => {
  return content;
};
