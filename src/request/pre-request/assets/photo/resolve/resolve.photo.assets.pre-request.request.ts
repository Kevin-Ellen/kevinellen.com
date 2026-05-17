// src/request/pre-request/assets/photo/resolve/resolve.photo.assets.pre-request.request.ts

import type { PhotoAssetResolution } from "@request/pre-request/assets/photo/types/photo-assets.pre-request.request.types";

import {
  DEFAULT_PHOTO_VARIANT,
  PHOTO_ASSET_PATH_PATTERN,
} from "@request/pre-request/assets/photo/config/config.photo-assets.pre-request.request";

const PHOTO_VARIANT_FIT = "cover";
const PHOTO_VARIANT_FORMAT = "auto";

const NUMERIC_DIMENSION_PATTERN = /^\d+$/;

const shouldUseDefaultPhotoVariant = (
  width?: string,
  height?: string,
): boolean => width === undefined && height === undefined;

const hasCompletePhotoVariantDimensions = (
  width?: string,
  height?: string,
): width is string => width !== undefined && height !== undefined;

const hasNumericPhotoVariantDimensions = (
  width: string,
  height: string,
): boolean =>
  NUMERIC_DIMENSION_PATTERN.test(width) &&
  NUMERIC_DIMENSION_PATTERN.test(height);

const buildPhotoVariant = (width: string, height: string): string =>
  [
    `w=${width}`,
    `h=${height}`,
    `fit=${PHOTO_VARIANT_FIT}`,
    `format=${PHOTO_VARIANT_FORMAT}`,
  ].join(",");

export const photoAssetResolver = (req: Request): PhotoAssetResolution => {
  const pathname = new URL(req.url).pathname;

  const match = PHOTO_ASSET_PATH_PATTERN.exec(pathname);

  if (!match) {
    return {
      outcome: "continue",
    };
  }

  const [, photoId, width, height] = match;

  if (shouldUseDefaultPhotoVariant(width, height)) {
    return {
      outcome: "asset",
      asset: {
        imageId: photoId,
        variant: DEFAULT_PHOTO_VARIANT,
      },
    };
  }

  if (
    !hasCompletePhotoVariantDimensions(width, height) ||
    !hasNumericPhotoVariantDimensions(width, height)
  ) {
    return {
      outcome: "continue",
    };
  }

  return {
    outcome: "asset",
    asset: {
      imageId: photoId,
      variant: buildPhotoVariant(width, height),
    },
  };
};
