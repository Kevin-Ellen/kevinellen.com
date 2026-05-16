// src/request/response/policy.response.request.ts

import type { AppRenderContext } from "@app-render-context/class.app-render-context";

import { resolveHtmlCacheControlHeader } from "@request/response/cache.response.request";
import { applyBaseResponseHeaders } from "@request/response/headers.response.request";
import { resolveRobotsResponseHeader } from "@request/response/robots.response.request";

export const createResponsePolicyHeaders = (
  responsePolicy: AppRenderContext["responsePolicy"],
  env: Env,
): Headers => {
  const headers = new Headers();

  applyBaseResponseHeaders(headers, responsePolicy.nonce);

  headers.set(
    "cache-control",
    resolveHtmlCacheControlHeader(env, responsePolicy.status),
  );

  headers.set("x-runtime-policy", "html");

  const robotsHeader = resolveRobotsResponseHeader(responsePolicy.robots, env);

  if (robotsHeader !== null) {
    headers.set("x-robots-tag", robotsHeader);
  }

  return headers;
};
