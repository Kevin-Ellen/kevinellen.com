// src/app-state/resolve/page-content/inline/strong.resolve.app-state.ts

import type { AuthoredStrongInline } from "@shared-types/page-content/inline/strong/authored.strong.inline-content.types";
import type { AppStateStrongInline } from "@shared-types/page-content/inline/strong/app-state.strong.inline-content.types";

import { appStateResolveInline } from "@app-state/resolve/page-content/inline/inline.page-content.resolve.app-state";

export const appStateResolveStrongInline = (
  content: AuthoredStrongInline,
): AppStateStrongInline => {
  return {
    ...content,
    content: content.content.map(appStateResolveInline),
  };
};
