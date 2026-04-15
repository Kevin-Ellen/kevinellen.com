// src/request/request.ts

import { appStateCreate } from "@app-state/create.app-state";
import { preAppContextOrchestrator } from "@request/pre-app-context/pre-app-context.request";
import { preRequestOrchestrator } from "@request/pre-request/pre-request.request";

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

  if (preAppContext.kind === "error") {
    return new Response("gone", {
      status: preAppContext.status,
    });
  }

  return new Response(JSON.stringify(appState.inspect, null, 2));
};
