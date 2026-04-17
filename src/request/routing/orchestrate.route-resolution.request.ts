// src/request/routing/orchestrate.route-resolution.request.ts

import type { AppState } from "@app-state/class.app-state";
import type {
  PreAppContextResult,
  RoutingResult,
} from "@request/types/request.types";

import { resolvePublicRoute } from "@request/routing/resolve.public-route.request";

export const orchestrateRouteResolution = (
  req: Request,
  appState: AppState,
  preAppContext: Extract<
    PreAppContextResult,
    { kind: "continue" } | { kind: "error" }
  >,
): RoutingResult => {
  if (preAppContext.kind === "error") {
    return preAppContext;
  }

  const pathname = new URL(req.url).pathname;

  return resolvePublicRoute(pathname, appState);
};
