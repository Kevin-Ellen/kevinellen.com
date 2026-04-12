// src/app/request/pre-request/handle.pre-request.request.ts

import { staticAssetOrchestrator } from "@request/pre-request/static-assets/static.assets.pre-request.request";
import { photoAssetOrchestrator } from "@request/pre-request/photo-assets/photo.assets.pre-request.request";

export const preRequestOrchestrator = async (
  req: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response | null> => {
  const staticAssetResponse = await staticAssetOrchestrator(req, env, ctx);

  if (staticAssetResponse) {
    return staticAssetResponse;
  }

  const photoAssetResponse = await photoAssetOrchestrator(req, env, ctx);

  if (photoAssetResponse) {
    return photoAssetResponse;
  }

  return null;
};
