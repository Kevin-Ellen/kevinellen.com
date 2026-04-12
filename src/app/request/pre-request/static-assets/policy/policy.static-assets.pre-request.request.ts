// src/app/request/pre-request/static-assets/policy/policy.static-assets.pre-request.request.ts

import type { StaticAssetRequest } from "@request/pre-request/static-assets/types/static-assets.pre-request.request.types";

const getCacheControlValue = (asset: StaticAssetRequest): string => {
  switch (asset.cacheProfile) {
    case "icon":
      return "public, max-age=86400, stale-while-revalidate=86400";

    case "font":
      return "public, max-age=31536000, immutable";

    case "image":
      return "public, max-age=86400, stale-while-revalidate=86400";
  }
};

export const staticAssetResponsePolicy = (
  response: Response,
  asset: StaticAssetRequest,
): Response => {
  const headers = new Headers(response.headers);

  headers.set("content-type", asset.contentType);
  headers.set("cache-control", getCacheControlValue(asset));
  headers.set("x-content-type-options", "nosniff");
  headers.set("x-runtime-policy", "asset");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
