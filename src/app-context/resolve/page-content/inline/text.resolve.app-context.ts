// src/app-context/resolve/page-content/inline/text.resolve.app-context.ts

import type { AppStateTextInline } from "@shared-types/page-content/inline/text/app-state.text.inline-content.types";
import type { AppContextTextInline } from "@shared-types/page-content/inline/text/app-context.text.inline-content.types";

export const appContextResolveTextInline = (
  content: AppStateTextInline,
): AppContextTextInline => {
  return content;
};
