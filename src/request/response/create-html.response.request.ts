// src/request/response/create-html.response.request.ts

import type { AppRenderContext } from "@app-render-context/class.app-render-context";

import { createResponsePolicyHeaders } from "@request/response/policy.response.request";

export const createHtmlResponse = (
  document: string,
  appRenderContext: AppRenderContext,
  env: Env,
): Response => {
  const headers = createResponsePolicyHeaders(
    appRenderContext.responsePolicy,
    env,
  );

  headers.set("content-type", "text/html; charset=utf-8");

  return new Response(document, {
    status: appRenderContext.responsePolicy.status,
    headers,
  });
};
