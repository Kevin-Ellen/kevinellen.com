// src/request/pre-request/assets/assets.pre-request.request.ts
import { staticAssetOrchestrator } from "@request/pre-request/assets/static/static.assets.pre-request.request";
import { photoAssetOrchestrator } from "@request/pre-request/assets/photo/photo.assets.pre-request.request";

export const orchestrateAssetsPreRequest = async (
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
