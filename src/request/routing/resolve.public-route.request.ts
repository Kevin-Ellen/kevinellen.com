// src/request/routing/resolve.public-route.request.ts

import type { AppState } from "@app-state/class.app-state";
import type { RoutingResult } from "@request/types/request.types";

export const resolvePublicRoute = (
  pathname: string,
  appState: AppState,
): RoutingResult => {
  const page = appState.getPublicPageBySlug(pathname);

  if (!page) {
    return {
      kind: "error",
      status: 404,
    };
  }

  return {
    kind: "found",
    publicPageId: page.id,
  };
};
