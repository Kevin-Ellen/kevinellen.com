// tests/src/app/policies/response/security/apply.security.headers.response.policy.test.ts

import { applySecurityHeadersResponsePolicy } from "@app/policies/response/security/apply.security.headers.response.policy";
import type { ResponsePolicyContext } from "@app/policies/response/response.policies.types";

const createContext = (): ResponsePolicyContext => ({
  req: new Request("https://example.com/test"),
  env: {
    APP_ENV: "dev",
    APP_HOST: "kevinellen.com",
  } as Env,
  appState: {} as never,
  target: {} as never,
  security: {
    nonce: "testnonce123",
  },
});

describe("applySecurityHeadersResponsePolicy", () => {
  it("sets the standard security headers", () => {
    const context = createContext();
    const response = new Response("<html>Hello</html>");

    const result = applySecurityHeadersResponsePolicy(context, response);

    expect(result.headers.get("cross-origin-opener-policy")).toBe(
      "same-origin",
    );
    expect(result.headers.get("cross-origin-resource-policy")).toBe(
      "same-origin",
    );
    expect(result.headers.get("referrer-policy")).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(result.headers.get("x-content-type-options")).toBe("nosniff");
    expect(result.headers.get("x-frame-options")).toBe("DENY");
  });

  it("preserves unrelated headers when adding security headers", () => {
    const context = createContext();

    const response = new Response("<html>Hello</html>", {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "x-render-mode": "document",
      },
    });

    const result = applySecurityHeadersResponsePolicy(context, response);

    expect(result.headers.get("content-type")).toBe("text/html; charset=utf-8");
    expect(result.headers.get("x-render-mode")).toBe("document");
    expect(result.headers.get("cross-origin-opener-policy")).toBe(
      "same-origin",
    );
    expect(result.headers.get("cross-origin-resource-policy")).toBe(
      "same-origin",
    );
    expect(result.headers.get("referrer-policy")).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(result.headers.get("x-content-type-options")).toBe("nosniff");
    expect(result.headers.get("x-frame-options")).toBe("DENY");
  });

  it("preserves status and statusText when rebuilding the response", () => {
    const context = createContext();

    const response = new Response("<html>Hello</html>", {
      status: 410,
      statusText: "Gone",
    });

    const result = applySecurityHeadersResponsePolicy(context, response);

    expect(result.status).toBe(410);
    expect(result.statusText).toBe("Gone");
  });

  it("preserves the response body when rebuilding the response", async () => {
    const context = createContext();
    const response = new Response("<html>Hello</html>");

    const result = applySecurityHeadersResponsePolicy(context, response);

    await expect(result.text()).resolves.toBe("<html>Hello</html>");
  });

  it("returns a new response instance when security headers are added", () => {
    const context = createContext();
    const response = new Response("<html>Hello</html>");

    const result = applySecurityHeadersResponsePolicy(context, response);

    expect(result).not.toBe(response);
  });
});
