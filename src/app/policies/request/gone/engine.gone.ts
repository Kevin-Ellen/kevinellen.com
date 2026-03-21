// src/app/policies/request/gone/engine.gone.ts

import type { PreRoutingOutcome } from "@app/request/request.types";

import { goneRules } from "@app/policies/request/gone/rules.gone";
import { getRequestPath } from "@src/app/request/request.utils";

export const evaluateGonePolicy = (req: Request): PreRoutingOutcome => {
  const path = getRequestPath(req);

  if (!goneRules.includes(path)) {
    return { type: "continue" };
  }

  return {
    type: "render-error",
    intent: { kind: "gone" },
  };
};
