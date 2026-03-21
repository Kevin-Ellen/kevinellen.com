// src/app/policies/response/content-type/apply.content-type.response.policies.ts

import type {
  ResponseFormat,
  ResponsePolicyContext,
} from "@app/policies/response/response.policies.types";

const CONTENT_TYPES: Record<ResponseFormat, string | null> = {
  html: "text/html; charset=utf-8",
  json: "application/json; charset=utf-8",
  xml: "application/xml; charset=utf-8",
  text: "text/plain; charset=utf-8",
  ico: "image/x-icon",
  woff2: "font/woff2",
  image: null,
  binary: null,
};

export const applyContentTypeResponsePolicies = (
  context: ResponsePolicyContext,
): Response => {
  const contentType = CONTENT_TYPES[context.responseFormat];

  if (!contentType) {
    return context.response;
  }

  const headers = new Headers(context.response.headers);
  headers.set("content-type", contentType);

  return new Response(context.response.body, {
    status: context.response.status,
    statusText: context.response.statusText,
    headers,
  });
};
