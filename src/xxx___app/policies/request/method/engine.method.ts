// src/app/policies/request/method/engine.method.ts

import type { PreRoutingOutcome } from "@app/request/request.types";
import type { AllowedMethods } from "@app/policies/request/method/method.types";

const allowedMethods: AllowedMethods = ["GET", "HEAD"] as const;

const isAllowedMethod = (method: string): boolean => {
  return allowedMethods.includes(method as (typeof allowedMethods)[number]);
};

export const evaluateMethodPolicy = (req: Request): PreRoutingOutcome => {
  if (isAllowedMethod(req.method)) {
    return { type: "continue" };
  }

  return {
    type: "direct-response",
    response: new Response(null, {
      status: 405,
      headers: {
        allow: allowedMethods.join(", "),
        "x-runtime-policy": "method",
      },
    }),
  };
};
