// src/app/request/router.request.ts

import type { AppState } from "@app/appState/appState";
import type { RouteResult } from "@app/request/request.types";

export const routeRequest = (slug: string, appState: AppState): RouteResult => {
  const page = appState.getPageBySlug(slug);

  return page ? { kind: "found", page } : { kind: "not-found" };
};
