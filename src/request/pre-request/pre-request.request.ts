// src/request/pre-request/pre-request.request.ts

import { orchestrateAssetsPreRequest } from "@request/pre-request/assets/assets.pre-request.request";
import { orchestrateGuardPreRequest } from "@request/pre-request/guard/guard.pre-request.request";

export const preRequestOrchestrator = async (
  req: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response | null> => {
  const guardResult = await orchestrateGuardPreRequest(req);
  if (guardResult) {
    return guardResult;
  }

  const assetsResult = await orchestrateAssetsPreRequest(req, env, ctx);

  if (assetsResult) {
    return assetsResult;
  }

  return null;
};
