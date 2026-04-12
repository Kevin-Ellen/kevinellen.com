// src/app/request/pre-request/photo-assets/photo.assets.pre-request.request.ts

import { photoAssetResolver } from "@request/pre-request/photo-assets/resolve/resolve.photo.assets.pre-request.request";
import { photoAssetResponsePolicy } from "@request/pre-request/photo-assets/policy/policy.photo-assets.pre-request.request";

const buildCloudflareImageUrl = (
  accountHash: string,
  imageId: string,
  variant: string,
): string => {
  return `https://imagedelivery.net/${accountHash}/${imageId}/${variant}`;
};

export const photoAssetOrchestrator = async (
  req: Request,
  env: Env,
  _ctx: ExecutionContext,
): Promise<Response | null> => {
  const assetResolution = photoAssetResolver(req);

  if (assetResolution.outcome !== "asset") {
    return null;
  }

  if (!env.CF_IMAGES_DELIVERY_HASH) {
    throw new Error("Photo: CF_IMAGES_DELIVERY_HASH not set.");
  }

  const imageUrl = buildCloudflareImageUrl(
    env.CF_IMAGES_DELIVERY_HASH,
    assetResolution.asset.imageId,
    assetResolution.asset.variant,
  );

  const upstreamResponse = await fetch(imageUrl);

  if (upstreamResponse.status === 404) {
    return null;
  }

  return photoAssetResponsePolicy(upstreamResponse);
};
