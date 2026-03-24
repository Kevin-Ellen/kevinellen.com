// src/app/policies/request/redirects/apply.redirects.ts

import type { RequestResolutionOutcome } from "@app/request/resolution/apply.resolution.types";
import type { RedirectRules } from "@app/request/resolution/redirects/redirects.types";

import { redirectRules } from "@app/request/resolution/redirects/rules.redirects";
import { getRequestPath } from "@src/utils/request.util";

export const applyRedirectResolution = (
  req: Request,
  rules: RedirectRules = redirectRules,
): RequestResolutionOutcome => {
  const path = getRequestPath(req);

  const rule = rules.find((r) => r.fromPath === path);

  if (!rule) {
    return { type: "continue" };
  }

  return {
    type: "direct-response",
    responseFormat: "text",
    response: new Response(null, {
      status: rule.status,
      headers: {
        location: rule.toPath,
        "x-runtime-policy": "redirect",
      },
    }),
  };
};
