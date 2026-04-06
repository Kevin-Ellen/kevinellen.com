// src/app/policies/response/run.response.policies.ts

import type { DocumentRenderTarget } from "@app/request/request.document.types";
import type { RenderContext } from "@app/renderContext/class.renderContext";
import type { ResponsePolicyContext } from "@app/policies/response/response.policies.types";

import { runResponseStage } from "@app/policies/response/run.response.stage";
import { applyCacheResponsePolicy } from "@app/policies/response/cache/apply.cache.response.policy";
import { applyRobotsResponsePolicy } from "@app/policies/response/robots/apply.robots.response.policy";
import { applyCspResponsePolicy } from "@app/policies/response/security/apply.csp.response.policy";
import { applySecurityHeadersResponsePolicy } from "@app/policies/response/security/apply.security.headers.response.policy";

export const runResponsePolicies = (
  req: Request,
  env: Env,
  target: DocumentRenderTarget,
  renderContext: RenderContext,
  response: Response,
): Response => {
  const responsePolicyContext: ResponsePolicyContext = {
    req,
    env,
    status: target.status,
    security: {
      nonce: renderContext.security.nonce,
    },
    robots: {
      allowIndex: target.page.config.robots.allowIndex,
      allowFollow: target.page.config.robots.allowFollow,
      noarchive: target.page.config.robots.noarchive,
      nosnippet: target.page.config.robots.nosnippet,
      noimageindex: target.page.config.robots.noimageindex,
    },
  };

  return runResponseStage(responsePolicyContext, response, [
    applyRobotsResponsePolicy,
    applyCspResponsePolicy,
    applySecurityHeadersResponsePolicy,
    applyCacheResponsePolicy,
  ]);
};
