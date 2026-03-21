// tests/src/app/policies/response/caching/apply.caching.response.policies.ts

import type { ResponsePolicyContext } from "@app/policies/response/response.policies.types";

const DOCUMENT_CACHE_CONTROL = "no-store";

export const applyCachingResponsePolicies = (
  context: ResponsePolicyContext,
): Response => {
  if (context.responseKind !== "document") {
    return context.response;
  }

  const headers = new Headers(context.response.headers);
  headers.set("cache-control", DOCUMENT_CACHE_CONTROL);

  return new Response(context.response.body, {
    status: context.response.status,
    statusText: context.response.statusText,
    headers,
  });
};
