// src/app-state/resolve/pages/public/public.page.resolve.app-state.ts

import type { AuthoredPublicPageDefintion } from "@shared-types/pages/definitions/public/authored.public.definition.page.types";
import type { AppStatePublicPageDefintion } from "@shared-types/pages/definitions/public/app-state.public.definition.page.types";

import { appStateResolvePageRobots } from "./robots.resolve.app-state";

export const appStateResolvePublicPage = (
  page: AuthoredPublicPageDefintion,
): AppStatePublicPageDefintion => {
  return {
    ...page,
    robots: appStateResolvePageRobots(page.robots),
    assets: {
      scripts: page.assets?.scripts ?? [],
      svg: page.assets?.svg ?? [],
    },
    breadcrumbs: page.breadcrumbs ?? [],
    structuredData: page.structuredData ?? [],
  };
};
