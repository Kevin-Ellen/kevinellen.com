// src/app-state/resolve/pages/error/error.page.resolve.app-state.ts

import type { AuthoredErrorPageDefinition } from "@shared-types/pages/definitions/error/authored.base.error.definition.page.types";
import type { AppStateErrorPageDefinition } from "@shared-types/pages/definitions/error/app-state.base.error.definition.page.types";

import { appStateResolvePageContent } from "@app-state/resolve/page-content/page-content.resolve.app-state";

export const appStateResolveErrorPage = (
  page: AuthoredErrorPageDefinition,
): AppStateErrorPageDefinition => {
  return {
    ...page,
    content: appStateResolvePageContent(page.content),
    breadcrumbs: ["home", page.id],
    assets: {
      svg: [],
      scripts: [],
    },
  };
};
