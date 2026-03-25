// src/app/policies/request/run.request.guard.stage.ts

import type { RequestPolicyOutcome } from "@app/policies/request/request.policies.types";

import { evaluateMethodRequestGuard } from "@app/policies/request/guards/evaluate.method.request.guard";

export const runRequestGuardStage = (
  request: Request,
): RequestPolicyOutcome => {
  const methodOutcome = evaluateMethodRequestGuard(request);

  if (methodOutcome.kind !== "continue") {
    return methodOutcome;
  }

  return { kind: "continue" };
};
