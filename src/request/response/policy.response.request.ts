// src/request/response/policy.response.request.ts

import type { AppRenderContext } from "@app-render-context/class.app-render-context";

import { applyBaseResponseHeaders } from "@request/response/headers.response.request";
import { resolveRobotsResponseHeader } from "@request/response/robots.response.request";

export const createResponsePolicyHeaders = (
  responsePolicy: AppRenderContext["responsePolicy"],
  env: Env,
): Headers => {
  const headers = new Headers();

  applyBaseResponseHeaders(headers, responsePolicy.nonce);

  const robotsHeader = resolveRobotsResponseHeader(responsePolicy.robots, env);

  if (robotsHeader !== null) {
    headers.set("x-robots-tag", robotsHeader);
  }

  return headers;
};
