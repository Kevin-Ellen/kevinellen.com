// src/app/policies/response/orchestrator.response.policies.ts

import type { AppState } from "@app/appState/appState";
import type { ResponsePolicyContext } from "@app/policies/response/response.policies.types";

import { applyBaseResponsePolicies } from "@app/policies/response/base/apply.base.response.policies";
import { applyContentTypeResponsePolicies } from "@app/policies/response/content-type/apply.content-type.response.policies";
import { applySecurityResponsePolicies } from "@app/policies/response/security/apply.security.response.policies";
import { applyRobotsResponsePolicies } from "@app/policies/response/robots/apply.robots.response.policies";
import { applyCspResponsePolicies } from "@app/policies/response/security/apply.csp.response.policies";
import { applyCachingResponsePolicies } from "@app/policies/response/caching/apply.caching.response.policies";

export const orchestrateResponsePolicies = (
  context: ResponsePolicyContext,
  _appState: AppState,
): Response => {
  let response = context.response;

  response = applyBaseResponsePolicies({
    ...context,
    response,
  });

  response = applyContentTypeResponsePolicies({
    ...context,
    response,
  });

  response = applySecurityResponsePolicies({
    ...context,
    response,
  });

  response = applyRobotsResponsePolicies({
    ...context,
    response,
  });

  response = applyCspResponsePolicies({
    ...context,
    response,
  });

  response = applyCachingResponsePolicies({
    ...context,
    response,
  });

  return response;
};
