// src/app/policies/response/security/apply.csp.response.policies.ts

import type { ResponsePolicyContext } from "@app/policies/response/response.policies.types";

const buildDocumentCsp = (context: ResponsePolicyContext): string => {
  const nonce = context.appContext.getDocument().nonce;

  const scriptSrc = nonce
    ? `script-src 'self' 'nonce-${nonce}'`
    : "script-src 'self'";

  const styleSrc = nonce
    ? `style-src 'self' 'nonce-${nonce}'`
    : "style-src 'self'";

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    scriptSrc,
    styleSrc,
    "img-src 'self' data: https:",
    "font-src 'self' https: data:",
    "connect-src 'self'",
    "form-action 'self'",
    "manifest-src 'self'",
  ].join("; ");
};

export const applyCspResponsePolicies = (
  context: ResponsePolicyContext,
): Response => {
  if (context.appContext.getResponseKind() !== "document") {
    return context.response;
  }

  const headers = new Headers(context.response.headers);
  headers.set("content-security-policy", buildDocumentCsp(context));

  return new Response(context.response.body, {
    status: context.response.status,
    statusText: context.response.statusText,
    headers,
  });
};
