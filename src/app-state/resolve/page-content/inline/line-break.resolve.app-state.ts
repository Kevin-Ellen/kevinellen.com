// src/app-state/resolve/page-content/inline/line-break.resolve.app-state.ts

import type { AuthoredLineBreakInline } from "@shared-types/page-content/inline/line-break/authored.line-break.inline-content.types";
import type { AppStateLineBreakInline } from "@shared-types/page-content/inline/line-break/app-state.line-break.inline-content.types";

export const appStateResolveLineBreakInline = (
  content: AuthoredLineBreakInline,
): AppStateLineBreakInline => {
  return content;
};
