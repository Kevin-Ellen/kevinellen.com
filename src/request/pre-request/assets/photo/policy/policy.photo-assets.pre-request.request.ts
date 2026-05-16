// src/request/pre-request/assets/photo/policy/policy.photo-assets.pre-request.request.ts

import { resolvePhotoAssetRobotsResponseHeader } from "@request/pre-request/assets/photo/robots/robots.photo-assets.pre-request.request";

export const photoAssetResponsePolicy = (
  response: Response,
  env: Env,
): Response => {
  const headers = new Headers(response.headers);

  headers.set("cache-control", "public, max-age=31536000, immutable");
  headers.set("x-runtime-policy", "photo");

  const robotsHeader = resolvePhotoAssetRobotsResponseHeader(env);

  if (robotsHeader !== null) {
    headers.set("x-robots-tag", robotsHeader);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
