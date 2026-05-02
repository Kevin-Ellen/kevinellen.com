// src/request/pre-request/assets/photo/resolve/resolve.photo.assets.pre-request.request.ts

import type { PhotoAssetResolution } from "@request/pre-request/assets/photo/types/photo-assets.pre-request.request.types";

import {
  DEFAULT_PHOTO_VARIANT,
  PHOTO_ASSET_PATH_PATTERN,
} from "@request/pre-request/assets/photo/config/config.photo-assets.pre-request.request";

export const photoAssetResolver = (req: Request): PhotoAssetResolution => {
  const pathname = new URL(req.url).pathname;

  const match = PHOTO_ASSET_PATH_PATTERN.exec(pathname);

  if (!match) {
    return {
      outcome: "continue",
    };
  }

  const [, photoId, width, height] = match;

  return {
    outcome: "asset",
    asset: {
      imageId: photoId,
      variant:
        width && height
          ? `w=${width},h=${height},fit=cover`
          : DEFAULT_PHOTO_VARIANT,
    },
  };
};
