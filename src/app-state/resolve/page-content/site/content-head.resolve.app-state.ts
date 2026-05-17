// src/app-state/resolve/page-content/site/content-head.resolve.app-state.ts

import type { AuthoredPageContentHead } from "@shared-types/page-content/site/content-head/authored.content-head.types";
import type { AppStatePageContentHead } from "@shared-types/page-content/site/content-head/app-state.content-head.types";

export const appStateResolvePageContentHead = (
  head: AuthoredPageContentHead,
): AppStatePageContentHead => {
  return {
    ...head,
    eyebrow: head.eyebrow ?? null,
    intro: head.intro ?? null,
    showInBody: head.showInBody ?? true,
  };
};
