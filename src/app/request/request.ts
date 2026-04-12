// src/app/request/request.ts

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

  return new Response("hi");
};
