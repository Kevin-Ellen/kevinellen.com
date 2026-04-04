// src/app/policies/response/recurity/apply.csp.response.policy.ts

import type { ResponsePolicy } from "@app/policies/response/response.policies.types";

const buildContentSecurityPolicy = (nonce: string): string => {
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    `script-src 'self' 'nonce-${nonce}'`,
    `style-src 'self' 'nonce-${nonce}'`,
    "img-src 'self' data: https:",
    "font-src 'self' https: data:",
    "connect-src 'self'",
    "form-action 'self'",
    "manifest-src 'self'",
  ].join("; ");
};

export const applyCspResponsePolicy: ResponsePolicy = (
  context,
  response,
): Response => {
  const headers = new Headers(response.headers);

  headers.set(
    "content-security-policy",
    buildContentSecurityPolicy(context.security.nonce),
  );

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
