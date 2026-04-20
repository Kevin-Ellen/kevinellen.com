// src/app-context/resolve/page/page.resolve.app-context.ts

import type { AppState } from "@app-state/class.app-state";
import type { RoutingResult } from "@request/types/request.types";
import type { AppContextPublicPageDefinition } from "@shared-types/pages/definitions/public/app-context.public.definition.page.types";
import type { AppContextErrorPageDefinition } from "@shared-types/pages/definitions/error/app-context.base.error.definition.page.types";

export const resolvePageAppContext = (
  appState: AppState,
  routing: RoutingResult,
): AppContextPublicPageDefinition | AppContextErrorPageDefinition => {
  if (routing.kind === "found") {
    const page = appState.getPublicPageById(routing.publicPageId);

    if (!page) {
      throw new Error(
        `Missing public page for routing id '${routing.publicPageId}'.`,
      );
    }

    return page;
  }

  const page = appState.getErrorPageByStatus(routing.status);

  if (!page) {
    throw new Error(`Missing error page for status '${routing.status}'.`);
  }

  return page;
};
