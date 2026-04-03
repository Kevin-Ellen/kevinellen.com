// src/entry.ts

import { createAppState } from "@app/appState/create.appState";
import { handleRequest } from "@app/request/handler.request";

export const onRequest = async (
  req: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> => {
  const appState = createAppState();

  return handleRequest(req, env, ctx, appState);
};

export default {
  fetch: onRequest,
};
