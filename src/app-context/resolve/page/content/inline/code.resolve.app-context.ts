// src/app-context/resolve/page/content/inline/code.resolve.app-context.ts

import type { AppStateCodeInlineContent } from "@shared-types/page-content/inline/code/app-state.code.inline-content.page-content.types";
import type { AppContextCodeInlineContent } from "@shared-types/page-content/inline/code/app-context.code.inline-content.page-content.types";

export const appContextResolveCodeInlineContent = (
  content: AppStateCodeInlineContent,
): AppContextCodeInlineContent => {
  return content;
};
