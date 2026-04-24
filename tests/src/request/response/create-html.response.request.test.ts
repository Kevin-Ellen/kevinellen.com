// tests/src/request/response/create-html.response.request.test.ts

import { createHtmlResponse } from "@request/response/create-html.response.request";

describe("createHtmlResponse", () => {
  const buildAppRenderContext = (
    overrides?: Partial<{
      status: number;
      robots: string[];
      nonce: string;
    }>,
  ) =>
    ({
      responsePolicy: {
        status: overrides?.status ?? 200,
        robots: overrides?.robots ?? [],
        nonce: overrides?.nonce ?? "test-nonce-123",
      },
    }) as never;

  it("creates an HTML response with the correct status and content-type", async () => {
    const response = createHtmlResponse(
      "<!doctype html><html></html>",
      buildAppRenderContext(),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(
      "text/html; charset=utf-8",
    );

    await expect(response.text()).resolves.toBe("<!doctype html><html></html>");
  });

  it("uses the response policy status", () => {
    const response = createHtmlResponse(
      "<html><body>Gone</body></html>",
      buildAppRenderContext({
        status: 410,
      }),
    );

    expect(response.status).toBe(410);
  });

  it("adds x-robots-tag when robots directives exist", () => {
    const response = createHtmlResponse(
      "<html></html>",
      buildAppRenderContext({
        robots: ["noindex", "nofollow"],
      }),
    );

    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
  });

  it("does not add x-robots-tag when robots directives are empty", () => {
    const response = createHtmlResponse(
      "<html></html>",
      buildAppRenderContext({
        robots: [],
      }),
    );

    expect(response.headers.get("x-robots-tag")).toBeNull();
  });

  it("adds the correct content security policy using the nonce", () => {
    const nonce = "secure-nonce-456";

    const response = createHtmlResponse(
      "<html></html>",
      buildAppRenderContext({
        nonce,
      }),
    );

    expect(response.headers.get("content-security-policy")).toBe(
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
      ].join("; "),
    );
  });

  it("adds the security headers", () => {
    const response = createHtmlResponse(
      "<html></html>",
      buildAppRenderContext(),
    );

    expect(response.headers.get("x-content-type-options")).toBe("nosniff");

    expect(response.headers.get("referrer-policy")).toBe(
      "strict-origin-when-cross-origin",
    );

    expect(response.headers.get("permissions-policy")).toBe(
      "camera=(), microphone=(), geolocation=()",
    );

    expect(response.headers.get("cross-origin-opener-policy")).toBe(
      "same-origin",
    );
  });
});
