// src/app-state/resolve/page-content/inline/strong.resolve.app-state.ts

import type { AuthoredStrongInlineContent } from "@shared-types/page-content/inline/strong/authored.strong.inline-content.page-content.types";
import type { AppStateStrongInlineContent } from "@shared-types/page-content/inline/strong/app-state.strong.inline-content.page-content.types";

import { appStateResolveInlineContent } from "./inline.page-content.resolve.app-state";

export const appStateResolveStrongInlineContent = (
  content: AuthoredStrongInlineContent,
): AppStateStrongInlineContent => {
  return {
    ...content,
    content: content.content.map(appStateResolveInlineContent),
  };
};
