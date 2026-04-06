// src/entry.ts

import { createAppState } from "@app/appState/create.appState";
import { requestHandler } from "@app/handlers/request.handler";

export const onRequest = async (
  req: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> => {
  const appState = createAppState();

  return requestHandler(req, env, ctx, appState);
};

export default {
  fetch: onRequest,
};
