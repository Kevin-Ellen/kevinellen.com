// src/app/request/resolution/gone/apply.gone.resolution.ts

import type { RequestResolutionOutcome } from "@app/request/resolution/apply.resolution.types";

import { goneRules } from "@app/request/resolution/gone/rules.gone";
import { getRequestPath } from "@utils/request.util";

export const applyGoneResolution = (req: Request): RequestResolutionOutcome => {
  const path = getRequestPath(req);

  if (!goneRules.includes(path)) {
    return { type: "continue" };
  }

  return {
    type: "render-error",
    intent: { kind: "gone" },
  };
};
