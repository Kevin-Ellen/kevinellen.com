// src/app-state/resolve/page-content/inline/code.resolve.app-state.ts

import type { AuthoredCodeInline } from "@shared-types/page-content/inline/code/authored.code.inline-content.types";
import type { AppStateCodeInline } from "@shared-types/page-content/inline/code/app-state.code.inline-content.types";

export const appStateResolveCodeInline = (
  content: AuthoredCodeInline,
): AppStateCodeInline => {
  return content;
};
