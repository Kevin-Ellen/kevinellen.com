// src/request/inspect/inspect.request.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppContext } from "@app-context/class.app-context";
import type { AppRenderContext } from "@app-render-context/class.app-render-context";
import type { RoutingResult } from "@request/types/request.types";

const INSPECT_QUERY_PARAM = "__inspect" as const;

const INSPECT_TARGETS = [
  "available",
  "app-state",
  "routing",
  "app-context",
  "app-render-context",
] as const;

type InspectTarget = (typeof INSPECT_TARGETS)[number];

type InspectArtifacts = Readonly<{
  appState?: AppState;
  routing?: RoutingResult;
  appContext?: AppContext;
  appRenderContext?: AppRenderContext;
}>;

const isInspectTarget = (value: string): value is InspectTarget =>
  INSPECT_TARGETS.includes(value as InspectTarget);

const jsonResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });

const availableInspectResponse = (): Response =>
  jsonResponse({
    queryParam: INSPECT_QUERY_PARAM,
    usage: [
      `?${INSPECT_QUERY_PARAM}`,
      `?${INSPECT_QUERY_PARAM}=available`,
      `?${INSPECT_QUERY_PARAM}=app-state`,
      `?${INSPECT_QUERY_PARAM}=routing`,
      `?${INSPECT_QUERY_PARAM}=app-context`,
      `?${INSPECT_QUERY_PARAM}=app-render-context`,
    ],
    availableTargets: INSPECT_TARGETS,
  });

const unavailableInspectResponse = (target: InspectTarget): Response =>
  jsonResponse(
    {
      error: `Inspect target '${target}' is not available at this stage.`,
      availableTargets: INSPECT_TARGETS,
    },
    409,
  );

const unknownInspectResponse = (target: string): Response =>
  jsonResponse(
    {
      error: `Unknown inspect target '${target}'.`,
      availableTargets: INSPECT_TARGETS,
    },
    400,
  );

export const inspectRequest = (
  req: Request,
  env: Env,
  artifacts: InspectArtifacts,
): Response | null => {
  if (env.APP_ENV !== "dev") {
    return null;
  }

  const url = new URL(req.url);

  if (!url.searchParams.has(INSPECT_QUERY_PARAM)) {
    return null;
  }

  const rawTarget = url.searchParams.get(INSPECT_QUERY_PARAM);
  const target =
    rawTarget === null || rawTarget === "" ? "available" : rawTarget;

  if (!isInspectTarget(target)) {
    return unknownInspectResponse(target);
  }

  switch (target) {
    case "available":
      return availableInspectResponse();

    case "app-state":
      return artifacts.appState
        ? jsonResponse(artifacts.appState.inspect)
        : unavailableInspectResponse(target);

    case "routing":
      return artifacts.routing
        ? jsonResponse(artifacts.routing)
        : unavailableInspectResponse(target);

    case "app-context":
      return artifacts.appContext
        ? jsonResponse(artifacts.appContext.inspect)
        : unavailableInspectResponse(target);

    case "app-render-context":
      return artifacts.appRenderContext
        ? jsonResponse(artifacts.appRenderContext.inspect)
        : unavailableInspectResponse(target);
  }
};
