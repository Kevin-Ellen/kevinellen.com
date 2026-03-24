// src/app/policies/response/security/apply.security.response.policies.ts

import type { ResponsePolicyContext } from "@app/policies/response/response.policies.types";

const X_FRAME_OPTIONS = "DENY";
const CROSS_ORIGIN_OPENER_POLICY = "same-origin";

export const applySecurityResponsePolicies = (
  context: ResponsePolicyContext,
): Response => {
  const headers = new Headers(context.response.headers);

  headers.set("x-frame-options", X_FRAME_OPTIONS);
  headers.set("cross-origin-opener-policy", CROSS_ORIGIN_OPENER_POLICY);

  return new Response(context.response.body, {
    status: context.response.status,
    statusText: context.response.statusText,
    headers,
  });
};
