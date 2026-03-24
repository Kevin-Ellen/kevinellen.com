// src/app/policies/request/orchestrator.policies.request.ts

import type { AppState } from "@app/appState/appState";
import type { PreRoutingOutcome } from "@app/request/request.types";
import type { RequestPolicyOutcome } from "@app/policies/request/request.policies.types";

import { routeRequest } from "@app/request/router.request";

import { evaluateRedirectPolicy } from "@app/policies/request/redirects/engine.redirects";
import { evaluateGonePolicy } from "@app/policies/request/NEEDS_MOVING_gone/engine.gone";
import { evaluateCanonicalPolicy } from "@app/policies/request/canonical/engine.canonical";
import { evaluateMethodPolicy } from "@app/policies/request/method/engine.method";

/* -------------------------------------------------------------------------- */
/* Pre-routing policy ordering contract                                       */
/* -------------------------------------------------------------------------- */
/*
  Policies in this stage must run in this order:

  1. Method policy
  2. Canonical policy
  3. Redirect policy
  4. Gone policy

  Ordering changes require corresponding test updates.
*/

const runPreRoutingStage = (
  req: Request,
  env: Env,
  _ctx: ExecutionContext,
  _appState: AppState,
): PreRoutingOutcome => {
  const methodOutcome = evaluateMethodPolicy(req);
  if (methodOutcome.type !== "continue") {
    return methodOutcome;
  }

  const canonicalOutcome = evaluateCanonicalPolicy(req, env);
  if (canonicalOutcome.type !== "continue") {
    return canonicalOutcome;
  }

  const redirectOutcome = evaluateRedirectPolicy(req);
  if (redirectOutcome.type !== "continue") {
    return redirectOutcome;
  }

  const goneOutcome = evaluateGonePolicy(req);
  if (goneOutcome.type !== "continue") {
    return goneOutcome;
  }

  return { type: "continue" };
};

const runRoutingStage = (req: Request, appState: AppState) => {
  const url = new URL(req.url);
  const slug = url.pathname;

  return routeRequest(slug, appState);
};

export const orchestrateRequestPolicies = (
  req: Request,
  env: Env,
  ctx: ExecutionContext,
  appState: AppState,
): RequestPolicyOutcome => {
  const preRoutingOutcome = runPreRoutingStage(req, env, ctx, appState);

  if (preRoutingOutcome.type === "direct-response") {
    return preRoutingOutcome;
  }

  if (preRoutingOutcome.type === "render-error") {
    return preRoutingOutcome;
  }

  const routingOutcome = runRoutingStage(req, appState);

  if (routingOutcome.kind === "not-found") {
    return {
      type: "render-error",
      intent: { kind: "not-found" },
    };
  }

  return {
    type: "render-page",
    page: routingOutcome.page,
    status: 200,
  };
};
