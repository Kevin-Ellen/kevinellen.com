// src/app/policies/request/run.request.policies.ts

import type { AppState } from "@app/appState/class.appState";
import type { RequestPolicyOutcome } from "@app/policies/request/request.policies.types";

import { runRequestGuardStage } from "@app/policies/request/run.request.guard.stage";
import { runRequestResolutionStage } from "@app/policies/request/run.request.resolution.stage";
import { runRequestSystemStage } from "@app/policies/request/run.request.system.stage";

export const runRequestPolicies = (
  req: Request,
  env: Env,
  appState: AppState,
): RequestPolicyOutcome => {
  const guardOutcome = runRequestGuardStage(req);

  if (guardOutcome.kind !== "continue") {
    return guardOutcome;
  }

  const resolutionOutcome = runRequestResolutionStage(req, env, appState);

  if (resolutionOutcome.kind !== "continue") {
    return resolutionOutcome;
  }

  const systemOutcome = runRequestSystemStage(req, env, appState);

  if (systemOutcome.kind !== "continue") {
    return systemOutcome;
  }

  return { kind: "continue" };
};
