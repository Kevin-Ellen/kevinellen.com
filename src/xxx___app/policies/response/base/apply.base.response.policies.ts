// src/app/policies/response/base/apply.base.response.policies.ts

import type { ResponsePolicyContext } from "@app/policies/response/response.policies.types";

export const applyBaseResponsePolicies = (
  context: ResponsePolicyContext,
): Response => {
  const headers = new Headers(context.response.headers);

  headers.set("x-content-type-options", "nosniff");
  headers.set("referrer-policy", "strict-origin-when-cross-origin");

  return new Response(context.response.body, {
    status: context.response.status,
    statusText: context.response.statusText,
    headers,
  });
};
