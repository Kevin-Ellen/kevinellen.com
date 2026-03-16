import {
  isProd,
  getCanonicalRedirect,
  resolveRobotsHeader,
} from "@app/policies/request.policy";

import type { AppPage } from "@types-src/appPage.types";

import { assertAllowedMethod } from "@app/policies/request.policy";
import { MethodNotAllowedError } from "@app/errors/http.errors";

const makePage = (overrides?: Partial<AppPage["config"]["robots"]>): AppPage =>
  ({
    config: {
      robots: {
        allowIndex: true,
        allowFollow: true,
        noarchive: false,
        nosnippet: false,
        noimageindex: false,
        ...overrides,
      },
    },
  }) as AppPage;

describe("request.policy", () => {
  describe("isProd", () => {
    it("returns true when APP_ENV is prod", () => {
      const env = { APP_ENV: "prod" } as Env;

      expect(isProd(env)).toBe(true);
    });

    it("returns false when APP_ENV is not prod", () => {
      const env = { APP_ENV: "dev" } as Env;

      expect(isProd(env)).toBe(false);
    });

    it("throws when APP_ENV is not defined", () => {
      const env = {} as Env;

      expect(() => isProd(env)).toThrow("APP_ENV not defined");
    });
  });

  describe("getCanonicalRedirect", () => {
    it("returns null outside prod", () => {
      const env = { APP_ENV: "dev" } as Env;
      const req = new Request("https://www.kevinellen.com/about");

      expect(getCanonicalRedirect(req, env)).toBeNull();
    });

    it("returns null in prod when hostname does not start with www", () => {
      const env = { APP_ENV: "prod" } as Env;
      const req = new Request("https://kevinellen.com/about");

      expect(getCanonicalRedirect(req, env)).toBeNull();
    });

    it("returns canonical non-www URL in prod when hostname starts with www", () => {
      const env = { APP_ENV: "prod" } as Env;
      const req = new Request("https://www.kevinellen.com/about?x=1");

      expect(getCanonicalRedirect(req, env)).toBe(
        "https://kevinellen.com/about?x=1",
      );
    });

    it("preserves pathname, query string, and hash in redirect", () => {
      const env = { APP_ENV: "prod" } as Env;
      const req = new Request(
        "https://www.kevinellen.com/articles/test?a=1&b=2#top",
      );

      expect(getCanonicalRedirect(req, env)).toBe(
        "https://kevinellen.com/articles/test?a=1&b=2#top",
      );
    });

    it("throws when APP_ENV is missing because isProd throws", () => {
      const env = {} as Env;
      const req = new Request("https://www.kevinellen.com/about");

      expect(() => getCanonicalRedirect(req, env)).toThrow(
        "APP_ENV not defined",
      );
    });
  });

  describe("resolveRobotsHeader", () => {
    it("returns noindex, nofollow outside prod", () => {
      const env = { APP_ENV: "dev" } as Env;
      const page = makePage({
        allowIndex: true,
        allowFollow: true,
      });

      expect(resolveRobotsHeader(page, env)).toBe("noindex, nofollow");
    });

    it("returns index, follow in prod when allowed", () => {
      const env = { APP_ENV: "prod" } as Env;
      const page = makePage({
        allowIndex: true,
        allowFollow: true,
      });

      expect(resolveRobotsHeader(page, env)).toBe("index, follow");
    });

    it("returns noindex, nofollow in prod when disallowed", () => {
      const env = { APP_ENV: "prod" } as Env;
      const page = makePage({
        allowIndex: false,
        allowFollow: false,
      });

      expect(resolveRobotsHeader(page, env)).toBe("noindex, nofollow");
    });

    it("returns only base directives when optional directives are false", () => {
      const env = { APP_ENV: "prod" } as Env;
      const page = makePage({
        allowIndex: false,
        allowFollow: true,
        noarchive: false,
        nosnippet: false,
        noimageindex: false,
      });

      expect(resolveRobotsHeader(page, env)).toBe("noindex, follow");
    });

    it("appends optional robots directives in prod", () => {
      const env = { APP_ENV: "prod" } as Env;
      const page = makePage({
        allowIndex: true,
        allowFollow: false,
        noarchive: true,
        nosnippet: true,
        noimageindex: true,
      });

      expect(resolveRobotsHeader(page, env)).toBe(
        "index, nofollow, noarchive, nosnippet, noimageindex",
      );
    });

    it("throws when APP_ENV is missing because isProd throws", () => {
      const env = {} as Env;
      const page = makePage();

      expect(() => resolveRobotsHeader(page, env)).toThrow(
        "APP_ENV not defined",
      );
    });
  });
});
describe("assertAllowedMethod", () => {
  it("does not throw for GET", () => {
    const req = new Request("https://kevinellen.com/about", {
      method: "GET",
    });

    expect(() => assertAllowedMethod(req)).not.toThrow();
  });

  it("does not throw for HEAD", () => {
    const req = new Request("https://kevinellen.com/about", {
      method: "HEAD",
    });

    expect(() => assertAllowedMethod(req)).not.toThrow();
  });

  it("throws MethodNotAllowedError for POST", () => {
    const req = new Request("https://kevinellen.com/about", {
      method: "POST",
    });

    expect(() => assertAllowedMethod(req)).toThrow(MethodNotAllowedError);
    expect(() => assertAllowedMethod(req)).toThrow("Method POST not allowed");
  });
});
