// src/request/response/headers.response.request.ts

const ONE_YEAR_IN_SECONDS = 31_536_000;

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

const buildStrictTransportSecurity = (): string =>
  [`max-age=${ONE_YEAR_IN_SECONDS}`, "includeSubDomains", "preload"].join("; ");

export const applyBaseResponseHeaders = (
  headers: Headers,
  nonce: string,
): Headers => {
  headers.set("content-security-policy", buildContentSecurityPolicy(nonce));

  headers.set("strict-transport-security", buildStrictTransportSecurity());
  headers.set("x-content-type-options", "nosniff");
  headers.set("x-frame-options", "DENY");

  headers.set("referrer-policy", "strict-origin-when-cross-origin");

  headers.set(
    "permissions-policy",
    [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "payment=()",
      "usb=()",
      "display-capture=()",
    ].join(", "),
  );

  headers.set("cross-origin-opener-policy", "same-origin");
  headers.set("cross-origin-resource-policy", "same-origin");

  return headers;
};
