// src/app-context/resolve/page-content/head/content-head.resolve.app-context.ts

import type { AppStatePageContentHead } from "@shared-types/page-content/site/content-head/app-state.content-head.types";
import type { AppContextPageContentHead } from "@shared-types/page-content/site/content-head/app-context.content-head.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

export const appContextResolvePageContentHead = (
  head: AppStatePageContentHead,
  _context: AppContextPageContentResolverContext,
): AppContextPageContentHead => {
  return head;
};
