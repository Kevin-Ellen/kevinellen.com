// src/app/policies/request/guards/evaluate.method.request.guard.ts

import type { RequestPolicyOutcome } from "@app/policies/request/request.policies.types";

const ALLOWED_METHODS = ["GET", "HEAD"] as const;
const ALLOWED_METHOD_SET = new Set(ALLOWED_METHODS);
const ALLOW_HEADER_VALUE = ALLOWED_METHODS.join(", ");

export const evaluateMethodRequestGuard = (
  request: Request,
): RequestPolicyOutcome => {
  if (
    ALLOWED_METHOD_SET.has(request.method as (typeof ALLOWED_METHODS)[number])
  ) {
    return { kind: "continue" };
  }

  return {
    kind: "direct-response",
    response: new Response(null, {
      status: 405,
      headers: {
        allow: ALLOW_HEADER_VALUE,
        "x-runtime-policy": "method",
      },
    }),
  };
};
