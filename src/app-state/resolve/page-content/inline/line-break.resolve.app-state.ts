// src/app-state/resolve/page-content/inline/line-break.resolve.app-state.ts

import type { AuthoredLineBreakInlineContent } from "@shared-types/page-content/inline/line-break/authored.line-break.inline-content.page-content.types";
import type { AppStateLineBreakInlineContent } from "@shared-types/page-content/inline/line-break/app-state.line-break.inline-content.page-content.types";

export const appStateResolveLineBreakInlineContent = (
  content: AuthoredLineBreakInlineContent,
): AppStateLineBreakInlineContent => {
  return content;
};
