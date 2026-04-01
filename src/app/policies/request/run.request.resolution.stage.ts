// src/app/policies/request/run.request.resolution.stage.ts

import type { AppState } from "@app/appState/class.appState";
import type { RequestPolicyOutcome } from "@app/policies/request/request.policies.types";

import { getRuntimeBehaviour } from "@app/runtime/get.runtime.behaviour";

import { evaluateRedirectRequestResolution } from "@app/policies/request/resolution/evaluate.redirect.request.resolution";
import { evaluateCanonicalRequestResolution } from "@app/policies/request/resolution/evaluate.canonical.request.resolution";
import { evaluateGonePathRequestResolution } from "@app/policies/request/resolution/evaluate.gone.request.resolution";

export const runRequestResolutionStage = (
  request: Request,
  env: Env,
  appState: AppState,
): RequestPolicyOutcome => {
  const runtime = getRuntimeBehaviour(env);

  const redirectOutcome = evaluateRedirectRequestResolution(request, appState);

  if (redirectOutcome.kind === "direct-response") {
    return redirectOutcome;
  }

  if (redirectOutcome.kind === "redirect") {
    const redirectTargetUrl = new URL(redirectOutcome.location, request.url);

    const canonicalRedirectTarget = evaluateCanonicalRequestResolution(
      redirectTargetUrl,
      runtime,
    );

    const redirectTargetPathname = canonicalRedirectTarget.url.pathname;

    const goneRedirectTargetOutcome = evaluateGonePathRequestResolution(
      redirectTargetPathname,
      appState,
    );

    if (goneRedirectTargetOutcome.kind !== "continue") {
      return goneRedirectTargetOutcome;
    }

    return {
      kind: "redirect",
      location: canonicalRedirectTarget.url.toString(),
      status: redirectOutcome.status,
    };
  }

  const requestUrl = new URL(request.url);

  const canonicalRequest = evaluateCanonicalRequestResolution(
    requestUrl,
    runtime,
  );

  const goneRequestOutcome = evaluateGonePathRequestResolution(
    canonicalRequest.url.pathname,
    appState,
  );

  if (goneRequestOutcome.kind !== "continue") {
    return goneRequestOutcome;
  }

  if (canonicalRequest.changed) {
    return {
      kind: "redirect",
      location: canonicalRequest.url.toString(),
      status: 308,
    };
  }

  return { kind: "continue" };
};
