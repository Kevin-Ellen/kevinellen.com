// src/app-state/resolve/page-content/page-content.resolve.app-state.ts

import type { AuthoredPageContent } from "@shared-types/page-content/authored.page-content.types";
import type { AppStatePageContent } from "@shared-types/page-content/app-state.page-content.types";

import { appStateResolvePageContentHead } from "@app-state/resolve/page-content/site/content-head.resolve.app-state";
import { appStateResolveBlock } from "@app-state/resolve/page-content/block/block.resolve.app-state";
import { appStateResolveFooter } from "@app-state/resolve/page-content/footer/footer.resolve.app-state";

export const appStateResolvePageContent = (
  content: AuthoredPageContent,
): AppStatePageContent => {
  return {
    head: appStateResolvePageContentHead(content.head),
    content: content.content.map(appStateResolveBlock),
    footer: (content.footer ?? []).map(appStateResolveFooter),
  };
};
