// src/app/policies/response/orchestrator.response.policies.ts

import type { AppState } from "@app/appState/appState";
import type { ResponsePolicyContext } from "@app/policies/response/response.policies.types";

/**
 * Response orchestration stage.
 *
 * Currently pass-through.
 *
 * Future responsibilities:
 * - security headers (CSP, HSTS, etc)
 * - SEO environment policy (noindex)
 * - caching policy
 * - content-type enforcement
 * - resource classification handling
 */
export const orchestrateResponsePolicies = (
  context: ResponsePolicyContext,
  _appState: AppState,
): Response => {
  return context.response;
};
