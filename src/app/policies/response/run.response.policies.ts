import type { AppState } from "@app/appState/class.appState";
import type { DocumentRenderTarget } from "@app/request/request.document.types";
import type { ResponsePolicySecurity } from "@app/policies/response/response.policies.types";

import { runResponseStage } from "@app/policies/response/run.response.stage";
import { applyCacheResponsePolicy } from "@app/policies/response/cache/apply.cache.response.policy";
import { applyRobotsResponsePolicy } from "@app/policies/response/robots/apply.robots.response.policy";
import { applyCspResponsePolicy } from "@app/policies/response/security/apply.csp.response.policy";
import { applySecurityHeadersResponsePolicy } from "@app/policies/response/security/apply.security.headers.response.policy";

export const runResponsePolicies = (
  req: Request,
  env: Env,
  appState: AppState,
  target: DocumentRenderTarget,
  security: ResponsePolicySecurity,
  response: Response,
): Response => {
  return runResponseStage(
    {
      req,
      env,
      appState,
      target,
      security,
    },
    response,
    [
      applyRobotsResponsePolicy,
      applyCspResponsePolicy,
      applySecurityHeadersResponsePolicy,
      applyCacheResponsePolicy,
    ],
  );
};
