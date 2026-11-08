// src/app/life-cycle/response/html/html.response.ts

import type { HtmlResponseOutput } from "../../../types/response/response.shared.type";

type Input = Readonly<{
  document: HtmlResponseOutput;
}>;

export const handleHtmlResponse = ({ document }: Input): Response => {
  const headers = new Headers({
    "Content-Type": "text/html; charset=utf-8",
  });

  new Headers(document.headers).forEach((value, key) => {
    headers.set(key, value);
  });

  headers.set("Cache-Control", "no-store");

  headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      `script-src 'self' 'nonce-${document.nonce}'`,
      `style-src 'self' 'nonce-${document.nonce}'`,
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  );

  return new Response(document.body, {
    status: document.status,
    headers,
  });
};
