// src/app-state/resolve/page-content/page-content.resolve.app-state.ts

import type { AuthoredPageContent } from "@shared-types/page-content/authored.page-content.types";
import type { AppStatePageContent } from "@shared-types/page-content/app-state.page-content.types";

import { appStateResolvePageContentHead } from "@app-state/resolve/page-content/content-head.resolve.app-state";
import { appStateResolveBlockContentModule } from "@app-state/resolve/page-content/block/block.page-content.resolve.app-state";

export const appStateResolvePageContent = (
  content: AuthoredPageContent,
): AppStatePageContent => {
  return {
    head: appStateResolvePageContentHead(content.head),
    body: content.body.map(appStateResolveBlockContentModule),
    footer: (content.footer ?? []).map(appStateResolveBlockContentModule),
  };
};
