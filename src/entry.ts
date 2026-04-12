// src/entry.ts

import { requestOrchestrator } from "@request/request";

export const onRequest = async (
  req: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> => await requestOrchestrator(req, env, ctx);

export default {
  fetch: onRequest,
};
