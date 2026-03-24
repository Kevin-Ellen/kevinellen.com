// src/app/policies/request/method/apply.method.ts

import type { RequestPolicyOutcome } from "@app/policies/request/request.policies.types";
import type {
  AllowedMethods,
  AllowedMethod,
} from "@app/policies/request/method/method.types";

const ALLOWED_METHODS: AllowedMethods = ["GET", "HEAD"] as const;

const isAllowedMethod = (method: string): method is AllowedMethod => {
  return ALLOWED_METHODS.includes(method as AllowedMethod);
};

export const applyMethodPolicy = (req: Request): RequestPolicyOutcome => {
  if (isAllowedMethod(req.method)) {
    return { type: "continue" };
  }

  return {
    type: "direct-response",
    response: new Response(null, {
      status: 405,
      headers: {
        allow: ALLOWED_METHODS.join(", "),
        "x-runtime-policy": "method",
      },
    }),
  };
};
