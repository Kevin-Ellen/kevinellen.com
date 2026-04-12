// src/request/pre-request/photo-assets/resolve/resolve.photo.assets.pre-request.request.ts

import type { PhotoAssetResolution } from "@request/pre-request/photo-assets/types/photo-assets.pre-request.request.types";

import { PHOTO_ASSET_PATH_PATTERN } from "@request/pre-request/photo-assets/config/config.photo-assets.pre-request.request";

export const photoAssetResolver = (req: Request): PhotoAssetResolution => {
  const pathname = new URL(req.url).pathname;

  const match = PHOTO_ASSET_PATH_PATTERN.exec(pathname);

  if (!match) {
    return {
      outcome: "continue",
    };
  }

  const [, imageId, variant] = match;

  return {
    outcome: "asset",
    asset: {
      imageId,
      variant,
    },
  };
};
