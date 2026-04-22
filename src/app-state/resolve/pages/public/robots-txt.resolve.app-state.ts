// src/app-state/resolve/pages/public/robots-txt.resolve.app-state.ts

import type { AuthoredPageRobotsTxtDirectives } from "@shared-types/page-definitions/robots-txt/authored.robots-txt.page-definition.types";
import type { AppStatePageRobotsTxtDirectives } from "@shared-types/page-definitions/robots-txt/app-state.robots-txt.page-definition.types";

const DEFAULT_APP_STATE_PAGE_ROBOTX_TXT = false;

// AppStatePageRobotsTxtDirectives

export const appStateResolvePageRobotsTxT = (
  robotsTxt?: AuthoredPageRobotsTxtDirectives,
): AppStatePageRobotsTxtDirectives => {
  return {
    disallow: robotsTxt?.disallow ?? DEFAULT_APP_STATE_PAGE_ROBOTX_TXT,
  };
};
