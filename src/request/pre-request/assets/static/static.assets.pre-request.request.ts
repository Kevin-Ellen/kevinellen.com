// src/request/pre-request/assets/static/static.assets.pre-request.request.ts

import type { PreRequestResult } from "@request/types/request.types";

import { staticAssetResolver } from "@request/pre-request/assets/static/resolve/resolve.static.assets.pre-request.request";
import { staticAssetResponsePolicy } from "@request/pre-request/assets/static/policy/policy.static-assets.pre-request.request";

export const staticAssetOrchestrator = async (
  req: Request,
  env: Env,
  _ctx: ExecutionContext,
): Promise<PreRequestResult> => {
  const assetResolution = staticAssetResolver(req);

  if (assetResolution.outcome !== "asset") {
    return null;
  }

  const assetUrl = new URL(req.url);
  assetUrl.pathname = assetResolution.asset.assetPath;

  const assetRequest = new Request(assetUrl.toString(), req);

  const response = await env.ASSETS.fetch(assetRequest);

  return staticAssetResponsePolicy(response, assetResolution.asset);
};
