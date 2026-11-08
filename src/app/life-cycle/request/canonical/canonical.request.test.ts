// src/app/life-cycle/request/canonical/canonical.request.test.ts

import type { RequestConfig } from "../config.request";

import { resolveCanonical } from "./canonical.request";

describe("Canonical request", () => {
  const domain = "https://kevinellen.com";

  const config = {
    trailingSlash: "remove",
  } as RequestConfig;

  const resolve = (
    input: string,
    options: {
      domain?: string;
      trailingSlash?: RequestConfig["trailingSlash"];
    } = {},
  ): URL =>
    resolveCanonical({
      url: new URL(input, domain),
      domain: options.domain ?? domain,
      config: {
        ...config,
        trailingSlash: options.trailingSlash ?? "remove",
      },
    });

  describe("Domain and protocol", () => {
    it("normalises the hostname and protocol", () => {
      const result = resolve("http://www.kevinellen.com/journal/example");

      expect(result.href).toBe("https://kevinellen.com/journal/example");
    });

    it("uses the configured canonical domain", () => {
      const result = resolve("https://example.com/journal/example", {
        domain: "https://photography.example.com",
      });

      expect(result.href).toBe(
        "https://photography.example.com/journal/example",
      );
    });

    it("preserves the configured protocol", () => {
      const result = resolve("https://example.com/about", {
        domain: "http://localhost:8787",
      });

      expect(result.href).toBe("http://localhost:8787/about");
    });

    it("preserves the configured port", () => {
      const result = resolve("https://example.com/about", {
        domain: "https://kevinellen.com:8443",
      });

      expect(result.host).toBe("kevinellen.com:8443");
    });
  });

  describe("Trailing slash removal", () => {
    it("preserves the root pathname", () => {
      expect(resolve("https://kevinellen.com/").pathname).toBe("/");
    });

    it("removes trailing slashes", () => {
      expect(
        resolve("https://kevinellen.com/journal/example///").pathname,
      ).toBe("/journal/example");
    });

    it("preserves paths without trailing slashes", () => {
      expect(resolve("https://kevinellen.com/about").pathname).toBe("/about");
    });
  });

  describe("Trailing slash addition", () => {
    it("adds a trailing slash when configured", () => {
      expect(
        resolve("https://kevinellen.com/about", {
          trailingSlash: "add",
        }).pathname,
      ).toBe("/about/");
    });

    it("does not duplicate existing trailing slashes", () => {
      expect(
        resolve("https://kevinellen.com/about///", {
          trailingSlash: "add",
        }).pathname,
      ).toBe("/about/");
    });

    it("does not add an additional slash to root", () => {
      expect(
        resolve("https://kevinellen.com/", {
          trailingSlash: "add",
        }).pathname,
      ).toBe("/");
    });
  });

  describe("Default pagination", () => {
    it.each([
      ["/journal/page-1", "/journal"],
      ["/topics/page-1", "/topics"],
      ["/topics/wildlife/page-1", "/topics/wildlife"],
    ])("normalises %s to %s", (input, expected) => {
      expect(resolve(input).pathname).toBe(expected);
    });

    it("normalises pagination before adding trailing slashes", () => {
      expect(
        resolve("/journal/page-1/", {
          trailingSlash: "add",
        }).pathname,
      ).toBe("/journal/");
    });

    it.each(["/journal/page-2", "/topics/page-3", "/topics/wildlife/page-4"])(
      "preserves non-default pagination %s",
      (pathname) => {
        expect(resolve(pathname).pathname).toBe(pathname);
      },
    );

    it.each(["/journals/page-1", "/about/page-1", "/photography/page-1"])(
      "does not normalise unrelated paths %s",
      (pathname) => {
        expect(resolve(pathname).pathname).toBe(pathname);
      },
    );

    it("does not normalise unrelated prefixes", () => {
      expect(resolve("/journalism/page-1").pathname).toBe("/journalism/page-1");
    });

    it("preserves case-sensitive pagination", () => {
      expect(resolve("/Journal/page-1").pathname).toBe("/Journal/page-1");
    });
  });

  describe("Query strings and fragments", () => {
    it("preserves query parameters", () => {
      const result = resolve(
        "http://example.com/journal/page-1?utm_source=test",
      );

      expect(result.href).toBe(
        "https://kevinellen.com/journal?utm_source=test",
      );
    });

    it("preserves URL fragments", () => {
      const result = resolve("https://example.com/about/#photography");

      expect(result.href).toBe("https://kevinellen.com/about#photography");
    });

    it("preserves query parameters and fragments together", () => {
      const result = resolve(
        "https://example.com/topics/page-1/?ref=nav#entries",
      );

      expect(result.href).toBe("https://kevinellen.com/topics?ref=nav#entries");
    });
  });

  describe("Input immutability", () => {
    it("does not mutate the original URL", () => {
      const original = new URL("http://www.kevinellen.com/journal/page-1/");

      const originalHref = original.href;

      const result = resolveCanonical({
        url: original,
        domain,
        config,
      });

      expect(original.href).toBe(originalHref);

      expect(result).not.toBe(original);

      expect(result.href).toBe("https://kevinellen.com/journal");
    });

    it("is idempotent", () => {
      const once = resolve("http://www.kevinellen.com/topics/page-1///");

      const twice = resolveCanonical({
        url: once,
        domain,
        config,
      });

      expect(twice.href).toBe(once.href);
    });
  });
});
