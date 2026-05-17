// src/app-state/resolve/page-content/inline/text.resolve.app-state.ts

import type { AuthoredTextInline } from "@shared-types/page-content/inline/text/authored.text.inline-content.types";
import type { AppStateTextInline } from "@shared-types/page-content/inline/text/app-state.text.inline-content.types";

export const appStateResolveTextInline = (
  content: AuthoredTextInline,
): AppStateTextInline => {
  return content;
};
