// src/app/life-cycle/request/redirects/redirects.request.test.ts

import type { RedirectEntry } from "../config.request";
import type { RedirectStatus } from "../../../types/system/redirects.system.type";

import { resolveRedirect } from "./redirects.request";

describe("Request redirects", () => {
  const origin = "https://kevinellen.com";

  const defaultStatus: RedirectStatus = 301;

  const resolve = (
    pathname: string,
    redirects: readonly RedirectEntry[] = [],
    status: RedirectStatus = defaultStatus,
  ) =>
    resolveRedirect({
      original: new URL(pathname, origin),
      redirects,
      defaultStatus: status,
    });

  describe("No matching redirects", () => {
    it("returns null when no rules exist", () => {
      expect(resolve("/about")).toBeNull();
    });

    it("returns null when no rule matches", () => {
      expect(
        resolve("/about", [{ from: "/journal", to: "/journals" }]),
      ).toBeNull();
    });

    it("returns null for an unmatched root path", () => {
      expect(resolve("/", [{ from: "/about", to: "/photography" }])).toBeNull();
    });
  });

  describe("Basic redirects", () => {
    it("resolves a simple internal redirect", () => {
      const result = resolve("/old", [{ from: "/old", to: "/new" }]);

      expect(result).toEqual({
        url: new URL(`${origin}/new`),
        status: 301,
        external: false,
      });
    });

    it("uses the configured default status", () => {
      const result = resolve("/old", [{ from: "/old", to: "/new" }], 302);

      expect(result?.status).toBe(302);
    });

    it("uses a rule-specific status", () => {
      const result = resolve("/old", [
        {
          from: "/old",
          to: "/new",
          status: 308,
        },
      ]);

      expect(result?.status).toBe(308);
    });

    it("uses the final rule status in a chain", () => {
      const result = resolve("/old", [
        { from: "/old", to: "/middle", status: 302 },
        { from: "/middle", to: "/new", status: 308 },
      ]);

      expect(result?.url.pathname).toBe("/new");
      expect(result?.status).toBe(308);
    });

    it("falls back to default status for the final rule", () => {
      const result = resolve("/old", [
        { from: "/old", to: "/middle", status: 302 },
        { from: "/middle", to: "/new" },
      ]);

      expect(result?.status).toBe(301);
    });
  });

  describe("Path normalisation", () => {
    it("matches paths regardless of trailing slash", () => {
      const result = resolve("/old/", [{ from: "/old", to: "/new" }]);

      expect(result?.url.pathname).toBe("/new");
    });

    it("normalises trailing slashes in rule sources", () => {
      const result = resolve("/old", [{ from: "/old///", to: "/new" }]);

      expect(result?.url.pathname).toBe("/new");
    });

    it("matches the root pathname", () => {
      const result = resolve("/", [{ from: "/", to: "/journal" }]);

      expect(result?.url.pathname).toBe("/journal");
    });

    it("normalises multiple root slashes", () => {
      const result = resolve("/", [{ from: "///", to: "/journal" }]);

      expect(result?.url.pathname).toBe("/journal");
    });

    it("uses case-sensitive path matching", () => {
      expect(resolve("/Old", [{ from: "/old", to: "/new" }])).toBeNull();
    });

    it("does not match partial paths", () => {
      expect(
        resolve("/old/example", [{ from: "/old", to: "/new" }]),
      ).toBeNull();
    });
  });

  describe("Query parameters", () => {
    it("preserves query parameters by default", () => {
      const result = resolve("/old?utm_source=test", [
        { from: "/old", to: "/new" },
      ]);

      expect(result?.url.href).toBe(`${origin}/new?utm_source=test`);
    });

    it("preserves multiple query parameters", () => {
      const result = resolve("/old?topic=wildlife&page=2", [
        { from: "/old", to: "/journal" },
      ]);

      expect(result?.url.search).toBe("?topic=wildlife&page=2");
    });

    it("uses destination query parameters when specified", () => {
      const result = resolve("/old?source=original", [
        {
          from: "/old",
          to: "/new?source=destination",
        },
      ]);

      expect(result?.url.href).toBe(`${origin}/new?source=destination`);
    });

    it("supports destination query parameters without an existing query", () => {
      const result = resolve("/old", [
        {
          from: "/old",
          to: "/new?topic=wildlife",
        },
      ]);

      expect(result?.url.search).toBe("?topic=wildlife");
    });

    it("preserves queries across multiple redirects", () => {
      const result = resolve("/old?source=test", [
        { from: "/old", to: "/middle" },
        { from: "/middle", to: "/new" },
      ]);

      expect(result?.url.href).toBe(`${origin}/new?source=test`);
    });

    it("allows later rules to replace query parameters", () => {
      const result = resolve("/old?original=true", [
        { from: "/old", to: "/middle" },
        {
          from: "/middle",
          to: "/new?replacement=true",
        },
      ]);

      expect(result?.url.search).toBe("?replacement=true");
    });
  });

  describe("Redirect chains", () => {
    it("resolves multiple internal redirects", () => {
      const result = resolve("/old", [
        { from: "/old", to: "/middle" },
        { from: "/middle", to: "/new" },
        { from: "/new", to: "/final" },
      ]);

      expect(result?.url.href).toBe(`${origin}/final`);

      expect(result?.external).toBe(false);
    });

    it("does not mutate the original URL", () => {
      const original = new URL(`${origin}/old`);

      const result = resolveRedirect({
        original,
        redirects: [{ from: "/old", to: "/new" }],
        defaultStatus,
      });

      expect(original.href).toBe(`${origin}/old`);
      expect(result?.url.href).toBe(`${origin}/new`);
      expect(result?.url).not.toBe(original);
    });
  });

  describe("Redirect protection", () => {
    it("detects direct self redirects", () => {
      expect(() => resolve("/old", [{ from: "/old", to: "/old" }])).toThrow(
        `Self redirect detected: ${origin}/old`,
      );
    });

    it("detects self redirects with preserved queries", () => {
      expect(() =>
        resolve("/old?ref=test", [{ from: "/old", to: "/old" }]),
      ).toThrow(`Self redirect detected: ${origin}/old?ref=test`);
    });

    it("detects redirect loops", () => {
      expect(() =>
        resolve("/first", [
          { from: "/first", to: "/second" },
          { from: "/second", to: "/first" },
        ]),
      ).toThrow(`Redirect loop detected: ${origin}/first`);
    });

    it("detects longer redirect loops", () => {
      expect(() =>
        resolve("/first", [
          { from: "/first", to: "/second" },
          { from: "/second", to: "/third" },
          { from: "/third", to: "/first" },
        ]),
      ).toThrow(`Redirect loop detected: ${origin}/first`);
    });

    it("detects loops with preserved query parameters", () => {
      expect(() =>
        resolve("/first?ref=test", [
          { from: "/first", to: "/second" },
          { from: "/second", to: "/first" },
        ]),
      ).toThrow(`Redirect loop detected: ${origin}/first?ref=test`);
    });
  });

  describe("External redirects", () => {
    it("resolves external destinations", () => {
      const result = resolve("/external", [
        {
          from: "/external",
          to: "https://example.com/destination",
        },
      ]);

      expect(result?.url.href).toBe("https://example.com/destination");

      expect(result?.external).toBe(true);
    });

    it("preserves query parameters for external redirects", () => {
      const result = resolve("/external?ref=test", [
        {
          from: "/external",
          to: "https://example.com/destination",
        },
      ]);

      expect(result?.url.href).toBe("https://example.com/destination?ref=test");
    });

    it("uses destination queries for external redirects", () => {
      const result = resolve("/external?original=true", [
        {
          from: "/external",
          to: "https://example.com/destination?new=true",
        },
      ]);

      expect(result?.url.search).toBe("?new=true");
    });

    it("stops processing after an external redirect", () => {
      const result = resolve("/old", [
        {
          from: "/old",
          to: "https://example.com/second",
        },
        {
          from: "/second",
          to: "/unexpected",
        },
      ]);

      expect(result?.url.href).toBe("https://example.com/second");

      expect(result?.external).toBe(true);
    });

    it("handles an internal chain ending externally", () => {
      const result = resolve("/old", [
        { from: "/old", to: "/middle" },
        {
          from: "/middle",
          to: "https://example.com/final",
          status: 308,
        },
      ]);

      expect(result?.url.href).toBe("https://example.com/final");
      expect(result?.status).toBe(308);
      expect(result?.external).toBe(true);
    });

    it("treats protocol changes as external", () => {
      const result = resolve("/old", [
        {
          from: "/old",
          to: "http://kevinellen.com/new",
        },
      ]);

      expect(result?.external).toBe(true);
    });

    it("treats subdomains as external origins", () => {
      const result = resolve("/old", [
        {
          from: "/old",
          to: "https://www.kevinellen.com/new",
        },
      ]);

      expect(result?.external).toBe(true);
    });
  });

  describe("Rule precedence", () => {
    it("uses the first matching rule", () => {
      const result = resolve("/old", [
        { from: "/old", to: "/first" },
        { from: "/old", to: "/second" },
      ]);

      expect(result?.url.pathname).toBe("/first");
    });

    it("ignores unrelated rules", () => {
      const result = resolve("/old", [
        { from: "/unrelated", to: "/other" },
        { from: "/old", to: "/new" },
      ]);

      expect(result?.url.pathname).toBe("/new");
    });
  });
});
