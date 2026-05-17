// src/app-context/resolve/page-content/inline/line-break.resolve.app-context.ts

import type { AppStateLineBreakInline } from "@shared-types/page-content/inline/line-break/app-state.line-break.inline-content.types";
import type { AppContextLineBreakInline } from "@shared-types/page-content/inline/line-break/app-context.line-break.inline-content.types";

export const appContextResolveLineBreakInline = (
  content: AppStateLineBreakInline,
): AppContextLineBreakInline => {
  return content;
};
