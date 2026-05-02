// tests/src/request/response/headers.response.request.test.ts

import { applyBaseResponseHeaders } from "@request/response/headers.response.request";

describe("applyBaseResponseHeaders", () => {
  it("sets the content security policy with the supplied nonce", () => {
    const headers = new Headers();

    const result = applyBaseResponseHeaders(headers, "secure-nonce-456");

    expect(result).toBe(headers);
    expect(headers.get("content-security-policy")).toBe(
      [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "frame-ancestors 'none'",
        "script-src 'self' 'nonce-secure-nonce-456'",
        "style-src 'self' 'nonce-secure-nonce-456'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "form-action 'self'",
        "upgrade-insecure-requests",
      ].join("; "),
    );
  });

  it("sets the shared security headers", () => {
    const headers = new Headers();

    applyBaseResponseHeaders(headers, "test-nonce");

    expect(headers.get("x-content-type-options")).toBe("nosniff");
    expect(headers.get("referrer-policy")).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(headers.get("permissions-policy")).toBe(
      "camera=(), microphone=(), geolocation=()",
    );
    expect(headers.get("cross-origin-opener-policy")).toBe("same-origin");
  });

  it("preserves unrelated existing headers", () => {
    const headers = new Headers({
      "cache-control": "public, max-age=60",
    });

    applyBaseResponseHeaders(headers, "test-nonce");

    expect(headers.get("cache-control")).toBe("public, max-age=60");
  });
});
