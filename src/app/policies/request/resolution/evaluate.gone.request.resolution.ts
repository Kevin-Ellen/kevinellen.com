// src/app/policies/request/resolution/evaluate.gone.request.resolution.ts

import type { AppState } from "@app/appState/class.appState";
import type { RequestPolicyOutcome } from "@app/policies/request/request.policies.types";

export const evaluateGonePathRequestResolution = (
  pathname: string,
  appState: AppState,
): RequestPolicyOutcome => {
  const goneConfig = appState.gone;

  const isGone = goneConfig.some((rule) => rule.path === pathname);

  if (!isGone) {
    return { kind: "continue" };
  }

  return {
    kind: "render-error",
    intent: {
      status: 410,
    },
  };
};
