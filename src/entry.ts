// src/entry.ts

import { AppState } from "@app/appState/appState";
import { createAppSeed } from "@app/bootstrap/appSeed.create";
import { handleRequest } from "@app/request/handler.request";

export default {
  async fetch(
    req: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const appSeed = await createAppSeed();
    const appState = new AppState(appSeed);

    return handleRequest(req, env, ctx, appState);
  },
};
