// src/app-state/resolve/page-content/inline/code.resolve.app-state.ts

import type { AuthoredCodeInlineContent } from "@shared-types/page-content/inline/code/authored.code.inline-content.page-content.types";
import type { AppStateCodeInlineContent } from "@shared-types/page-content/inline/code/app-state.code.inline-content.page-content.types";

export const appStateResolveCodeInlineContent = (
  content: AuthoredCodeInlineContent,
): AppStateCodeInlineContent => {
  return content;
};
