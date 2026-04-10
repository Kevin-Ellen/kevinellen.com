// src/app/handlers/asset.handler.ts

import { resolveAssetRequest } from "@app/asset/resolver/resolve.asset";
import { applyAssetResponsePolicy } from "@app/asset/policies/apply.policy.asset";

export const assetHandler = async (
  req: Request,
  env: Env,
  _ctx: ExecutionContext,
): Promise<Response | null> => {
  const assetResolution = resolveAssetRequest(req);

  if (assetResolution.outcome !== "asset") {
    return null;
  }

  const assetUrl = new URL(req.url);
  assetUrl.pathname = assetResolution.asset.assetPath;

  const assetRequest = new Request(assetUrl.toString(), req);

  const response = await env.ASSETS.fetch(assetRequest);

  return applyAssetResponsePolicy(response, assetResolution.asset);
};
