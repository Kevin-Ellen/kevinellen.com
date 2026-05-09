// src/app-context/resolve/source.resolve.app-context.ts

import type { AppState } from "@app-state/class.app-state";
import type { RoutingResult } from "@request/types/request.types";
import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";

export const appContextResolvePageSource = (
  appState: AppState,
  routing: RoutingResult,
): AppStatePageDefinition => {
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
