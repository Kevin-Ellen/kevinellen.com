// src/request/request.ts

import { appStateCreate } from "@app-state/create.app-state";
import { preAppContextOrchestrator } from "@request/pre-app-context/pre-app-context.request";
import { preRequestOrchestrator } from "@request/pre-request/pre-request.request";
import { orchestrateRouteResolution } from "@request/routing/orchestrate.route-resolution.request";

import { appContextCreate } from "@app-context/create.app-context";

import { inspectRequest } from "@request/inspect/inspect.request";
import { appRenderContextCreate } from "@app-render-context/create.app-render-context";

export const requestOrchestrator = async (
  req: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> => {
  const preRequest = await preRequestOrchestrator(req, env, ctx);

  if (preRequest) {
    return preRequest;
  }

  const appState = appStateCreate(env);

  const preAppContext = await preAppContextOrchestrator(req, env, appState);

  if (preAppContext.kind === "direct-response") {
    return preAppContext.response;
  }

  const routing = orchestrateRouteResolution(req, appState, preAppContext);

  const appContext = appContextCreate(appState, routing);

  const appRenderContext = appRenderContextCreate(appContext);

  const inspectResponse = inspectRequest(req, env, {
    appState,
    routing,
    appContext,
    appRenderContext,
  });

  if (inspectResponse) {
    return inspectResponse;
  }

  return new Response(JSON.stringify(appRenderContext.inspect, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
};
