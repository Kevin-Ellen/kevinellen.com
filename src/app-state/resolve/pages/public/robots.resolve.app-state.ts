// src/app-state/resolve/pages/public/robots.resolve.app-state.ts

import type { AppStatePageRobotsDirectives } from "@shared-types/page-definitions/robots/app-state.robots.page-definition.types";
import type { AuthoredPageRobotsDirectives } from "@shared-types/page-definitions/robots/authored.robots.page-definition.types";
const DEFAULT_APP_STATE_PAGE_ROBOTS: AppStatePageRobotsDirectives = {
  allowIndex: true,
  allowFollow: true,
  noarchive: false,
  nosnippet: false,
  noimageindex: false,
};

export const appStateResolvePageRobots = (
  robots?: AuthoredPageRobotsDirectives,
): AppStatePageRobotsDirectives => {
  return {
    allowIndex: robots?.allowIndex ?? DEFAULT_APP_STATE_PAGE_ROBOTS.allowIndex,
    allowFollow:
      robots?.allowFollow ?? DEFAULT_APP_STATE_PAGE_ROBOTS.allowFollow,
    noarchive: robots?.noarchive ?? DEFAULT_APP_STATE_PAGE_ROBOTS.noarchive,
    nosnippet: robots?.nosnippet ?? DEFAULT_APP_STATE_PAGE_ROBOTS.nosnippet,
    noimageindex:
      robots?.noimageindex ?? DEFAULT_APP_STATE_PAGE_ROBOTS.noimageindex,
  };
};
