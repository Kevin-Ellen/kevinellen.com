// src/app/policies/response/cache/apply.cache.response.policy.ts

import type { ResponsePolicy } from "@app/policies/response/response.policies.types";

export const applyCacheResponsePolicy: ResponsePolicy = (
  _context,
  response,
): Response => {
  const headers = new Headers(response.headers);

  headers.set("cache-control", "no-store");
  headers.set("pragma", "no-cache");
  headers.set("expires", "0");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
