// src/app-context/resolve/page-content/inline/code.resolve.app-context.ts

import type { AppStateCodeInline } from "@shared-types/page-content/inline/code/app-state.code.inline-content.types";
import type { AppContextCodeInline } from "@shared-types/page-content/inline/code/app-context.code.inline-content.types";

export const appContextResolveCodeInline = (
  content: AppStateCodeInline,
): AppContextCodeInline => {
  return content;
};
