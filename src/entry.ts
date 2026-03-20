// src/entry.ts

import { AppState } from "@app/appState/appState";
import { handleRequest } from "@app/request/handler.request";

export const buildAppState = async (): Promise<AppState> => {
  const { createAppSeed } = await import("@app/bootstrap/appSeed.create");
  const appSeed = await createAppSeed();

  return new AppState(appSeed);
};

export const onRequest = async (
  req: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> => {
  const appState = await buildAppState();

  return handleRequest(req, env, ctx, appState);
};

export default {
  fetch: onRequest,
};
