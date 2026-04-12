// src/request/request.ts

import { appStateCreate } from "@app-state/create.app-state";
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

  return new Response(JSON.stringify(appState.inspect, null, 2));
};
