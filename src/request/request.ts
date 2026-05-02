// src/request/request.ts

import { appStateCreate } from "@app-state/create.app-state";
import { appContextCreate } from "@app-context/create.app-context";
import { appRenderContextCreate } from "@app-render-context/create.app-render-context";

import { preRequestOrchestrator } from "@request/pre-request/pre-request.request";
import { preAppContextOrchestrator } from "@request/pre-app-context/pre-app-context.request";
import { orchestrateRouteResolution } from "@request/routing/orchestrate.route-resolution.request";
import { inspectRequest } from "@request/inspect/inspect.request";

import { createHtmlResponse } from "@request/response/create-html.response.request";

import { render } from "@rendering/renderer";

export const requestOrchestrator = async (
  req: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> => {
  const preRequest = await preRequestOrchestrator(req, env, ctx);

  if (preRequest) {
    return preRequest;
  }

  const appState = await appStateCreate(env);

  const preAppContext = await preAppContextOrchestrator(req, env, appState);

  if (preAppContext.kind === "direct-response") {
    return preAppContext.response;
  }

  const routing = orchestrateRouteResolution(req, appState, preAppContext);

  const appContext = await appContextCreate(appState, routing, env);

  const appRenderContext = appRenderContextCreate(appContext, env);

  const inspectResponse = inspectRequest(req, env, {
    appState,
    routing,
    appContext,
    appRenderContext,
  });

  if (inspectResponse) {
    return inspectResponse;
  }

  const document = render(appRenderContext);

  return createHtmlResponse(document, appRenderContext);
};
