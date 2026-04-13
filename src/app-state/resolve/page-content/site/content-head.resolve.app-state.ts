// src/app-state/resolve/page-content/site/content-head.resolve.app-state.ts

import type { AuthoredPageContentHead } from "@shared-types/page-content/site/content-head/authored.content-head.page-content.types";
import type { AppStatePageContentHead } from "@shared-types/page-content/site/content-head/app-state.content-head.page-content.types";

export const appStateResolvePageContentHead = (
  head: AuthoredPageContentHead,
): AppStatePageContentHead => {
  return {
    ...head,
    eyebrow: head.eyebrow ?? null,
    intro: head.intro ?? null,
  };
};
