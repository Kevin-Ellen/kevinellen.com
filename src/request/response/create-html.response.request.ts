// src/request/response/create-html.response.request.ts

import type { AppRenderContext } from "@app-render-context/class.app-render-context";

const buildContentSecurityPolicy = (nonce: string): string =>
  [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    `script-src 'self' 'nonce-${nonce}'`,
    `style-src 'self' 'nonce-${nonce}'`,
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ");

const createHtmlResponseHeaders = (
  responsePolicy: AppRenderContext["responsePolicy"],
): Headers => {
  const headers = new Headers();

  headers.set("content-type", "text/html; charset=utf-8");

  if (responsePolicy.robots.length > 0) {
    headers.set("x-robots-tag", responsePolicy.robots.join(", "));
  }

  headers.set(
    "content-security-policy",
    buildContentSecurityPolicy(responsePolicy.nonce),
  );
  headers.set("x-content-type-options", "nosniff");
  headers.set("referrer-policy", "strict-origin-when-cross-origin");
  headers.set("permissions-policy", "camera=(), microphone=(), geolocation=()");
  headers.set("cross-origin-opener-policy", "same-origin");

  return headers;
};

export const createHtmlResponse = (
  document: string,
  appRenderContext: AppRenderContext,
): Response =>
  new Response(document, {
    status: appRenderContext.responsePolicy.status,
    headers: createHtmlResponseHeaders(appRenderContext.responsePolicy),
  });
