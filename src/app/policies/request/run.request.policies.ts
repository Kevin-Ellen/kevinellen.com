// src/app/policies/request/run.request.policies.ts

import type { RequestPolicyOutcome } from "@app/policies/request/request.policies.types";

import { runRequestGuardStage } from "@app/policies/request/run.request.guard.stage";

/**
 * Runs request policy stages in deterministic order.
 *
 * Stage order:
 * 1. Guards (method, security)
 * 2. Resolution (redirects, gone)
 * 3. System artefacts (robots, manifest, sitemap)
 * 4. Rendering
 */
export const runRequestPolicies = (request: Request): RequestPolicyOutcome => {
  const guardOutcome = runRequestGuardStage(request);

  if (guardOutcome.kind !== "continue") {
    return guardOutcome;
  }

  return { kind: "continue" };
};
