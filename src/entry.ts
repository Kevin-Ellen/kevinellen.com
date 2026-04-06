// src/entry.ts

import { createAppState } from "@app/appState/create.appState";
import { requestHandler } from "@app/handlers/request.handler";

export const onRequest = async (
  req: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> => {
  const url = new URL(req.url);

  if (url.pathname.startsWith("/assets/")) {
    return env.ASSETS.fetch(req);
  }

  const appState = createAppState();

  return requestHandler(req, env, ctx, appState);
};

export default {
  fetch: onRequest,
};
