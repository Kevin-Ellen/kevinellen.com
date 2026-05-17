// src/request/response/headers.response.request.test.ts

import { applyBaseResponseHeaders } from "@request/response/headers.response.request";

describe("applyBaseResponseHeaders", () => {
  it("applies base security headers", () => {
    const headers = new Headers();

    const result = applyBaseResponseHeaders(headers, "test-nonce");

    expect(result).toBe(headers);

    expect(headers.get("content-security-policy")).toBe(
      [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "frame-ancestors 'none'",
        "script-src 'self' 'nonce-test-nonce'",
        "style-src 'self' 'nonce-test-nonce'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "form-action 'self'",
        "upgrade-insecure-requests",
      ].join("; "),
    );

    expect(headers.get("strict-transport-security")).toBe(
      "max-age=31536000; includeSubDomains; preload",
    );

    expect(headers.get("x-content-type-options")).toBe("nosniff");

    expect(headers.get("x-frame-options")).toBe("DENY");

    expect(headers.get("referrer-policy")).toBe(
      "strict-origin-when-cross-origin",
    );

    expect(headers.get("permissions-policy")).toBe(
      [
        "camera=()",
        "microphone=()",
        "geolocation=()",
        "payment=()",
        "usb=()",
        "display-capture=()",
      ].join(", "),
    );

    expect(headers.get("cross-origin-opener-policy")).toBe("same-origin");

    expect(headers.get("cross-origin-resource-policy")).toBe("same-origin");
  });
});
