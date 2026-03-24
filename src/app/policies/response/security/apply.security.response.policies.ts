// src/app/policies/response/security/apply.security.response.policies.ts

import type { ResponsePolicyContext } from "@app/policies/response/response.policies.types";
import { getRuntimeBehaviour } from "@utils/runtimeEnv.util";

const X_FRAME_OPTIONS = "DENY";
const CROSS_ORIGIN_OPENER_POLICY = "same-origin";
const CROSS_ORIGIN_RESOURCE_POLICY = "same-origin";
const CROSS_ORIGIN_EMBEDDER_POLICY = "require-corp";

export const applySecurityResponsePolicies = (
  context: ResponsePolicyContext,
): Response => {
  const headers = new Headers(context.response.headers);

  headers.set("x-frame-options", X_FRAME_OPTIONS);
  headers.set("cross-origin-opener-policy", CROSS_ORIGIN_OPENER_POLICY);
  headers.set("cross-origin-resource-policy", CROSS_ORIGIN_RESOURCE_POLICY);

  /**
   * COEP only when public runtime.
   * This avoids breaking dev tools / local debugging.
   */
  const runtime = getRuntimeBehaviour(context.appContext.getEnv());
  if (runtime.public) {
    headers.set("cross-origin-embedder-policy", CROSS_ORIGIN_EMBEDDER_POLICY);
  }

  return new Response(context.response.body, {
    status: context.response.status,
    statusText: context.response.statusText,
    headers,
  });
};
