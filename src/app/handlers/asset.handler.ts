// src/app/handlers/asset.handler.ts

import { resolveAssetRequest } from "@app/asset/resolver/resolve.asset";
import { applyAssetResponsePolicy } from "@app/asset/policies/apply.policy.asset";

export const assetHandler = async (
  req: Request,
  env: Env,
  _ctx: ExecutionContext,
): Promise<Response> => {
  const assetResolution = resolveAssetRequest(req);

  if (assetResolution.outcome !== "asset") {
    return new Response("Not Found", { status: 404 });
  }

  const response = await env.ASSETS.fetch(req);

  return applyAssetResponsePolicy(response, assetResolution.asset);
};
