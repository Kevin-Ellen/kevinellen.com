// src/request/inspect/inspect.request.ts

import type { AppState } from "@app-state/class.app-state";
import type { RoutingResult } from "@request/types/request.types";

type InspectArtifacts = {
  appState?: AppState;
  routing?: RoutingResult;
  resolvedPage?: unknown;
  appContext?: unknown;
  renderContext?: unknown;
};

const jsonResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });

const unavailableInspectResponse = (target: string): Response =>
  jsonResponse(
    {
      error: `Inspect target '${target}' is not available at this stage.`,
    },
    409,
  );

export const inspectRequest = (
  req: Request,
  env: Env,
  artifacts: InspectArtifacts,
): Response | null => {
  if (env.APP_ENV !== "dev") {
    return null;
  }

  const pathname = new URL(req.url).pathname;

  if (!pathname.startsWith("/_inspect")) {
    return null;
  }

  if (pathname === "/_inspect") {
    return jsonResponse({
      available: [
        "/_inspect/app-state",
        "/_inspect/routing",
        "/_inspect/resolved-page",
        "/_inspect/app-context",
        "/_inspect/render-context",
      ],
    });
  }

  if (pathname === "/_inspect/app-state") {
    return artifacts.appState
      ? jsonResponse(artifacts.appState.inspect)
      : unavailableInspectResponse("app-state");
  }

  if (pathname === "/_inspect/routing") {
    return artifacts.routing
      ? jsonResponse(artifacts.routing)
      : unavailableInspectResponse("routing");
  }

  if (pathname === "/_inspect/resolved-page") {
    return artifacts.resolvedPage
      ? jsonResponse(artifacts.resolvedPage)
      : unavailableInspectResponse("resolved-page");
  }

  if (pathname === "/_inspect/app-context") {
    return artifacts.appContext
      ? jsonResponse(artifacts.appContext)
      : unavailableInspectResponse("app-context");
  }

  if (pathname === "/_inspect/render-context") {
    return artifacts.renderContext
      ? jsonResponse(artifacts.renderContext)
      : unavailableInspectResponse("render-context");
  }

  return jsonResponse({ error: "Unknown inspect route." }, 404);
};
