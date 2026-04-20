// src/app-state/resolve/pages/error/error.page.resolve.app-state.ts

import type { AuthoredErrorPageDefinition } from "@shared-types/pages/definitions/error/authored.base.error.definition.page.types";
import type { AppStateErrorPageDefinition } from "@shared-types/pages/definitions/error/app-state.base.error.definition.page.types";

export const appStateResolveErrorPage = (
  page: AuthoredErrorPageDefinition,
): AppStateErrorPageDefinition => {
  return {
    ...page,
    breadcrumbs: ["home", page.id],
    assets: {
      svg: [],
      scripts: [],
    },
  };
};
