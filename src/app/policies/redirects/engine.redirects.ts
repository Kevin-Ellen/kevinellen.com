// src/app/policies/redirects/engine.redirects.ts

import type { PreRoutingOutcome } from "@app/request/request.types";

import { redirectRules } from "@app/policies/redirects/rules.redirects";
import { getRequestPath } from "@src/app/request/request.utils";

export const evaluateRedirectPolicy = (req: Request): PreRoutingOutcome => {
  const path = getRequestPath(req);

  const rule = redirectRules.find((r) => r.fromPath === path);

  if (!rule) {
    return { type: "continue" };
  }

  return {
    type: "direct-response",
    response: new Response(null, {
      status: rule.status,
      headers: {
        location: rule.toPath,
        "x-runtime-policy": "redirect",
      },
    }),
  };
};
