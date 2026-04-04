// tests/src/app/policies/response/cache/apply.cache.response.policy.test.ts

import { applyCacheResponsePolicy } from "@app/policies/response/cache/apply.cache.response.policy";
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

describe("applyCacheResponsePolicy", () => {
  it("sets strict no-store cache headers", () => {
    const context = createContext();
    const response = new Response("<html>Hello</html>");

    const result = applyCacheResponsePolicy(context, response);

    expect(result.headers.get("cache-control")).toBe("no-store");
    expect(result.headers.get("pragma")).toBe("no-cache");
    expect(result.headers.get("expires")).toBe("0");
  });

  it("preserves unrelated headers when adding cache headers", () => {
    const context = createContext();

    const response = new Response("<html>Hello</html>", {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "x-render-mode": "document",
      },
    });

    const result = applyCacheResponsePolicy(context, response);

    expect(result.headers.get("content-type")).toBe("text/html; charset=utf-8");
    expect(result.headers.get("x-render-mode")).toBe("document");
    expect(result.headers.get("cache-control")).toBe("no-store");
    expect(result.headers.get("pragma")).toBe("no-cache");
    expect(result.headers.get("expires")).toBe("0");
  });

  it("preserves status and statusText when rebuilding the response", () => {
    const context = createContext();

    const response = new Response("<html>Hello</html>", {
      status: 404,
      statusText: "Not Found",
    });

    const result = applyCacheResponsePolicy(context, response);

    expect(result.status).toBe(404);
    expect(result.statusText).toBe("Not Found");
  });

  it("preserves the response body when rebuilding the response", async () => {
    const context = createContext();
    const response = new Response("<html>Hello</html>");

    const result = applyCacheResponsePolicy(context, response);

    await expect(result.text()).resolves.toBe("<html>Hello</html>");
  });

  it("returns a new response instance when cache headers are added", () => {
    const context = createContext();
    const response = new Response("<html>Hello</html>");

    const result = applyCacheResponsePolicy(context, response);

    expect(result).not.toBe(response);
  });
});
