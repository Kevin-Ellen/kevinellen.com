// src/app/life-cycle/response/html/html.response.test.ts

import type { HtmlResponseOutput } from "../../../types/response/response.shared.type";

import { handleHtmlResponse } from "./html.response";

describe("HTML response", () => {
  const nonce = "test-nonce-123";

  const createDocument = (
    overrides: Partial<HtmlResponseOutput> = {},
  ): HtmlResponseOutput => ({
    kind: "html",
    status: 200,
    nonce,
    body: "<html><body>Hello world</body></html>",
    ...overrides,
  });

  const resolve = (overrides: Partial<HtmlResponseOutput> = {}): Response =>
    handleHtmlResponse({
      document: createDocument(overrides),
    });

  it("returns the configured HTTP status", () => {
    expect(resolve({ status: 404 }).status).toBe(404);
  });

  it("returns the HTML document body", async () => {
    const body = "<html><body>Journal entry</body></html>";

    const response = resolve({ body });

    expect(await response.text()).toBe(body);
  });

  it("sets the HTML content type", () => {
    const response = resolve();

    expect(response.headers.get("Content-Type")).toBe(
      "text/html; charset=utf-8",
    );
  });

  it("preserves custom document headers", () => {
    const response = resolve({
      headers: {
        "X-Robots-Tag": "noindex, nofollow",
        "X-Custom-Header": "test-value",
      },
    });

    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");

    expect(response.headers.get("X-Custom-Header")).toBe("test-value");
  });

  it("overrides custom cache policies with no-store", () => {
    const response = resolve({
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
    });

    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("defaults to no-store without custom headers", () => {
    expect(resolve().headers.get("Cache-Control")).toBe("no-store");
  });

  describe("Content Security Policy", () => {
    const expectedDirectives = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      `script-src 'self' 'nonce-${nonce}'`,
      `style-src 'self' 'nonce-${nonce}'`,
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ];

    it("sets the complete expected CSP", () => {
      const response = resolve();

      expect(response.headers.get("Content-Security-Policy")).toBe(
        expectedDirectives.join("; "),
      );
    });

    it("uses the document nonce for scripts and styles", () => {
      const response = resolve({
        nonce: "different-nonce",
      });

      const csp = response.headers.get("Content-Security-Policy");

      expect(csp).toContain("script-src 'self' 'nonce-different-nonce'");

      expect(csp).toContain("style-src 'self' 'nonce-different-nonce'");

      expect(csp).not.toContain("test-nonce-123");
    });

    it("overrides externally supplied CSP headers", () => {
      const response = resolve({
        headers: {
          "Content-Security-Policy": "default-src *",
        },
      });

      expect(response.headers.get("Content-Security-Policy")).toBe(
        expectedDirectives.join("; "),
      );
    });

    it("prohibits unsafe inline scripts and styles", () => {
      const csp = resolve().headers.get("Content-Security-Policy") ?? "";

      expect(csp).not.toContain("'unsafe-inline'");
      expect(csp).not.toContain("'unsafe-eval'");
    });

    it("restricts framing", () => {
      const csp = resolve().headers.get("Content-Security-Policy") ?? "";

      expect(csp).toContain("frame-ancestors 'none'");
    });

    it("prevents object embedding", () => {
      const csp = resolve().headers.get("Content-Security-Policy") ?? "";

      expect(csp).toContain("object-src 'none'");
    });
  });

  it("preserves custom content type overrides", () => {
    const response = resolve({
      headers: {
        "Content-Type": "text/html; charset=iso-8859-1",
      },
    });

    expect(response.headers.get("Content-Type")).toBe(
      "text/html; charset=iso-8859-1",
    );
  });
});
