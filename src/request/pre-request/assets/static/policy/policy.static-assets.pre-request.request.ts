// src/request/pre-request/assets/static/policy/policy.static-assets.pre-request.request.ts

import type { StaticAssetRequest } from "@request/pre-request/assets/static/types/static-assets.pre-request.request.types";

const STATIC_ASSET_CONTENT_SECURITY_POLICY = [
  "default-src 'none'",
  "base-uri 'none'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'none'",
  "sandbox",
].join("; ");

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

const applyStaticAssetSecurityHeaders = (headers: Headers): void => {
  headers.set("content-security-policy", STATIC_ASSET_CONTENT_SECURITY_POLICY);
  headers.set("x-content-type-options", "nosniff");
  headers.set("cross-origin-resource-policy", "same-origin");
};

export const staticAssetResponsePolicy = (
  response: Response,
  asset: StaticAssetRequest,
): Response => {
  const headers = new Headers(response.headers);

  headers.set("content-type", asset.contentType);
  headers.set("cache-control", getCacheControlValue(asset));
  headers.set("x-runtime-policy", "asset");

  applyStaticAssetSecurityHeaders(headers);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
