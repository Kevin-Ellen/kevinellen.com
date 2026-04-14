// src/app-state/resolve/pages/public/robots-txt.resolve.app-state.ts

import type { AuthoredRobotsTxt } from "@shared-types/pages/public/robots-txt/authored.robots-txt.public.page.types";
import type { AppStateRobotsTxt } from "@shared-types/pages/public/robots-txt/app-state.robots-txt.public.page.types";

const DEFAULT_APP_STATE_PAGE_ROBOTX_TXT = false;

// AppStatePageRobotsTxtDirectives

export const appStateResolvePageRobotsTxT = (
  robotsTxt?: AuthoredRobotsTxt,
): AppStateRobotsTxt => {
  return {
    disallow: robotsTxt?.disallow ?? DEFAULT_APP_STATE_PAGE_ROBOTX_TXT,
  };
};
