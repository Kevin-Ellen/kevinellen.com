// src/app-context/resolve/page/content/inline/text.resolve.app-context.ts

import type { AppStateTextInlineContent } from "@shared-types/page-content/inline/text/app-state.text.inline-content.page-content.types";
import type { AppContextTextInlineContent } from "@shared-types/page-content/inline/text/app-context.text.inline-content.page-content.types";

export const appContextResolveTextInlineContent = (
  content: AppStateTextInlineContent,
): AppContextTextInlineContent => {
  return content;
};
