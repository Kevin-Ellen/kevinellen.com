// src/app/policies/response/security/apply.security.headers.response.policy.ts

import type { ResponsePolicy } from "@app/policies/response/response.policies.types";

export const applySecurityHeadersResponsePolicy: ResponsePolicy = (
  _context,
  response,
): Response => {
  const headers = new Headers(response.headers);

  headers.set("cross-origin-opener-policy", "same-origin");
  headers.set("cross-origin-resource-policy", "same-origin");
  headers.set("referrer-policy", "strict-origin-when-cross-origin");
  headers.set("x-content-type-options", "nosniff");
  headers.set("x-frame-options", "DENY");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
