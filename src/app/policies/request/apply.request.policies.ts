// src/app/policies/request/apply.request.policies.ts

import type { AppState } from "@app/appState/appState";
import type { RequestPolicyOutcome } from "@app/policies/request/request.policies.types";

import { applyCanonicalPolicy } from "@app/policies/request/canonical/apply.canonical";
import { applyMethodPolicy } from "@app/policies/request/method/apply.method";
// import other policies here

export const applyRequestPolicies = (
  req: Request,
  env: Env,
  _ctx: ExecutionContext,
  _appState: AppState,
): RequestPolicyOutcome => {
  // Stage 1. Method policy
  const methodOutcome = applyMethodPolicy(req);
  if (methodOutcome.type !== "continue") {
    return methodOutcome;
  }

  // Stage 2. Canonical policy
  const canonicalOutcome = applyCanonicalPolicy(req, env);
  if (canonicalOutcome.type !== "continue") {
    return canonicalOutcome;
  }

  return { type: "continue" };
};
