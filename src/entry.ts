// src/entry.ts

import { createAppState } from "@app/appState/create.appState";

export const onRequest = async (
  _req: Request,
  _env: Env,
  _ctx: ExecutionContext,
): Promise<Response> => {
  const appState = createAppState();
  // const appState = createAppState();

  // return handleRequest(req, env, ctx, appState);

  return new Response(JSON.stringify(appState.getErrorPages()));
};

export default {
  fetch: onRequest,
};
