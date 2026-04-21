// src/app-context/resolve/page/content/head/content-head.page.resolve.app-context.ts

import type { AppStatePageContentHead } from "@shared-types/page-content/site/content-head/app-state.content-head.page-content.types";
import type { AppContextPageContentHead } from "@shared-types/page-content/site/content-head/app-context.content-head.page-content.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

export const appContextResolvePageContentHead = (
  head: AppStatePageContentHead,
  _context: AppContextPageContentResolverContext,
): AppContextPageContentHead => {
  return head;
};
