// tests/src/app/request/resolution/redirects/apply.redirects.test.ts

import type { RedirectRules } from "@app/request/resolution/redirects/redirects.types";

import { applyRedirectResolution } from "@app/request/resolution/redirects/apply.redirects";

describe("applyRedirectResolution", () => {
  const createRequest = (path: string): Request =>
    new Request(`https://kevinellen.com${path}`);

  const expectDirectResponse = (
    result: ReturnType<typeof applyRedirectResolution>,
  ): Response => {
    if (result.type !== "direct-response") {
      throw new Error("Expected direct-response outcome");
    }

    return result.response;
  };

  describe("matching behaviour", () => {
    it("returns continue when no redirect rule matches the request path", () => {
      const req = createRequest("/does-not-exist");
      const rules: RedirectRules = [];

      const result = applyRedirectResolution(req, rules);

      expect(result).toEqual({ type: "continue" });
    });

    it("matches the request path exactly", () => {
      const req = createRequest("/old");
      const rules: RedirectRules = [
        {
          fromPath: "/old-path",
          toPath: "/new-path",
          status: 308,
        },
      ];

      const result = applyRedirectResolution(req, rules);

      expect(result).toEqual({ type: "continue" });
    });

    it("uses the first matching redirect rule when multiple rules share the same fromPath", () => {
      const req = createRequest("/old");
      const rules: RedirectRules = [
        {
          fromPath: "/old",
          toPath: "/first-target",
          status: 301,
        },
        {
          fromPath: "/old",
          toPath: "/second-target",
          status: 308,
        },
      ];

      const result = applyRedirectResolution(req, rules);
      const response = expectDirectResponse(result);

      expect(response.status).toBe(301);
      expect(response.headers.get("location")).toBe("/first-target");
      expect(response.headers.get("x-runtime-policy")).toBe("redirect");
    });
  });

  describe("redirect status support", () => {
    it.each<{
      fromPath: string;
      toPath: string;
      status: 301 | 302 | 307 | 308;
    }>([
      { fromPath: "/old-301", toPath: "/new-301", status: 301 },
      { fromPath: "/old-302", toPath: "/new-302", status: 302 },
      { fromPath: "/old-307", toPath: "/new-307", status: 307 },
      { fromPath: "/old-308", toPath: "/new-308", status: 308 },
    ])(
      "returns a $status redirect with correct headers when $fromPath matches",
      ({ fromPath, toPath, status }) => {
        const req = createRequest(fromPath);

        const rules: RedirectRules = [
          {
            fromPath,
            toPath,
            status,
          },
        ];

        const result = applyRedirectResolution(req, rules);
        const response = expectDirectResponse(result);

        expect(response.status).toBe(status);
        expect(response.headers.get("location")).toBe(toPath);
        expect(response.headers.get("x-runtime-policy")).toBe("redirect");
      },
    );
  });

  describe("response contract", () => {
    it("sets only the expected redirect headers", () => {
      const req = createRequest("/old");

      const rules: RedirectRules = [
        {
          fromPath: "/old",
          toPath: "/new",
          status: 308,
        },
      ];

      const result = applyRedirectResolution(req, rules);
      const response = expectDirectResponse(result);

      expect(Object.fromEntries(response.headers.entries())).toEqual({
        location: "/new",
        "x-runtime-policy": "redirect",
      });
    });

    it("returns an empty response body for redirects", async () => {
      const req = createRequest("/old");

      const rules: RedirectRules = [
        {
          fromPath: "/old",
          toPath: "/new",
          status: 308,
        },
      ];

      const result = applyRedirectResolution(req, rules);
      const response = expectDirectResponse(result);

      await expect(response.text()).resolves.toBe("");
    });

    it("does not set a content-type header", () => {
      const req = createRequest("/old");

      const rules: RedirectRules = [
        {
          fromPath: "/old",
          toPath: "/new",
          status: 308,
        },
      ];

      const result = applyRedirectResolution(req, rules);
      const response = expectDirectResponse(result);

      expect(response.headers.get("content-type")).toBeNull();
    });

    it("exposes redirect headers in a case-insensitive way", () => {
      const req = createRequest("/old");

      const rules: RedirectRules = [
        {
          fromPath: "/old",
          toPath: "/new",
          status: 308,
        },
      ];

      const result = applyRedirectResolution(req, rules);
      const response = expectDirectResponse(result);

      expect(response.headers.get("Location")).toBe("/new");
      expect(response.headers.get("X-Runtime-Policy")).toBe("redirect");
    });

    it("returns the configured target path in the location header without rewriting it", () => {
      const req = createRequest("/old");

      const rules: RedirectRules = [
        {
          fromPath: "/old",
          toPath: "/new?ref=test",
          status: 308,
        },
      ];

      const result = applyRedirectResolution(req, rules);
      const response = expectDirectResponse(result);

      expect(response.headers.get("location")).toBe("/new?ref=test");
    });
  });
});
