// src/request/pre-request/assets/photo/policy/policy.photo-assets.pre-request.request.ts

import { resolvePhotoAssetRobotsResponseHeader } from "@request/pre-request/assets/photo/robots/robots.photo-assets.pre-request.request";

const PHOTO_ASSET_CACHE_CONTROL = "public, max-age=31536000, immutable";

const PHOTO_ASSET_CONTENT_SECURITY_POLICY = [
  "default-src 'none'",
  "base-uri 'none'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'none'",
  "sandbox",
].join("; ");

const applyPhotoAssetSecurityHeaders = (headers: Headers): void => {
  headers.set("content-security-policy", PHOTO_ASSET_CONTENT_SECURITY_POLICY);
  headers.set("x-content-type-options", "nosniff");
  headers.set("cross-origin-resource-policy", "cross-origin");
};

const applyPhotoAssetRobotsHeader = (headers: Headers, env: Env): void => {
  const robotsHeader = resolvePhotoAssetRobotsResponseHeader(env);

  if (robotsHeader !== null) {
    headers.set("x-robots-tag", robotsHeader);
    return;
  }

  headers.delete("x-robots-tag");
};

export const photoAssetResponsePolicy = (
  response: Response,
  env: Env,
): Response => {
  const headers = new Headers(response.headers);

  headers.set("cache-control", PHOTO_ASSET_CACHE_CONTROL);
  headers.set("x-runtime-policy", "photo");

  applyPhotoAssetSecurityHeaders(headers);
  applyPhotoAssetRobotsHeader(headers, env);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
