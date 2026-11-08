// src/app/life-cycle/request/request.test.ts

import type { ValidatedEnv } from "../../entry.type";

import { handleRequest } from "./request";
import { requestConfig } from "./config.request";
import { validateMethod } from "./method/method.request";
import { resolveRedirect } from "./redirects/redirects.request";
import { resolveCanonical } from "./canonical/canonical.request";

jest.mock("./method/method.request", () => ({
  validateMethod: jest.fn(),
}));

jest.mock("./redirects/redirects.request", () => ({
  resolveRedirect: jest.fn(),
}));

jest.mock("./canonical/canonical.request", () => ({
  resolveCanonical: jest.fn(),
}));

const mockedValidateMethod = jest.mocked(validateMethod);
const mockedResolveRedirect = jest.mocked(resolveRedirect);
const mockedResolveCanonical = jest.mocked(resolveCanonical);

describe("Request lifecycle", () => {
  const origin = "https://kevinellen.com";

  const env = {
    DOMAIN: origin,
  } as ValidatedEnv;

  const createRequest = (
    pathname = "/journal/example",
    method = "GET",
  ): Request => new Request(`${origin}${pathname}`, { method });

  const handle = (request: Request) => handleRequest({ request, env });

  beforeEach(() => {
    jest.resetAllMocks();

    mockedValidateMethod.mockReturnValue(null);
    mockedResolveRedirect.mockReturnValue(null);
    mockedResolveCanonical.mockImplementation(({ url }) => new URL(url));
  });

  describe("Method validation", () => {
    it("returns method rejections immediately", () => {
      const request = createRequest("/journal/example", "POST");

      const rejection = {
        ok: false,
        reason: "METHOD_NOT_ALLOWED",
      } as const;

      mockedValidateMethod.mockReturnValue(rejection);

      const result = handle(request);

      expect(result).toBe(rejection);

      expect(mockedValidateMethod).toHaveBeenCalledWith({
        request,
        allowedMethods: requestConfig.allowedMethods,
      });

      expect(mockedResolveRedirect).not.toHaveBeenCalled();
      expect(mockedResolveCanonical).not.toHaveBeenCalled();
    });

    it("continues when the method is allowed", () => {
      const request = createRequest();

      const result = handle(request);

      expect(result).toEqual({
        ok: true,
        request,
      });

      expect(mockedResolveRedirect).toHaveBeenCalledTimes(1);
      expect(mockedResolveCanonical).toHaveBeenCalledTimes(1);
    });
  });

  describe("Redirect resolution", () => {
    it("passes request configuration to redirect resolver", () => {
      const request = createRequest("/old");

      handle(request);

      expect(mockedResolveRedirect).toHaveBeenCalledWith({
        original: new URL(request.url),
        redirects: requestConfig.redirects,
        defaultStatus: requestConfig.defaultRedirectStatus,
      });
    });

    it("returns an internal redirect", () => {
      const request = createRequest("/old");

      mockedResolveRedirect.mockReturnValue({
        url: new URL(`${origin}/new`),
        status: 302,
        external: false,
      });

      const result = handle(request);

      expect(result).toEqual({
        ok: false,
        reason: "REDIRECT",
        status: 302,
        location: `${origin}/new`,
      });

      expect(mockedResolveCanonical).toHaveBeenCalledWith({
        url: new URL(`${origin}/new`),
        domain: env.DOMAIN,
        config: requestConfig,
      });
    });

    it("returns external redirects without canonicalisation", () => {
      const request = createRequest("/external");

      mockedResolveRedirect.mockReturnValue({
        url: new URL("https://example.com/destination"),
        status: 308,
        external: true,
      });

      const result = handle(request);

      expect(result).toEqual({
        ok: false,
        reason: "REDIRECT",
        status: 308,
        location: "https://example.com/destination",
      });

      expect(mockedResolveCanonical).not.toHaveBeenCalled();
    });

    it("uses the default status for canonical redirects", () => {
      const request = createRequest("/about/");

      mockedResolveCanonical.mockReturnValue(new URL(`${origin}/about`));

      const result = handle(request);

      expect(result).toEqual({
        ok: false,
        reason: "REDIRECT",
        status: requestConfig.defaultRedirectStatus,
        location: `${origin}/about`,
      });
    });

    it("uses the redirect status when canonicalisation follows a rule", () => {
      const request = createRequest("/old/");

      mockedResolveRedirect.mockReturnValue({
        url: new URL(`${origin}/new/`),
        status: 307,
        external: false,
      });

      mockedResolveCanonical.mockReturnValue(new URL(`${origin}/new`));

      const result = handle(request);

      expect(result).toEqual({
        ok: false,
        reason: "REDIRECT",
        status: 307,
        location: `${origin}/new`,
      });
    });
  });

  describe("Canonicalisation", () => {
    it("passes the original URL when no redirect matches", () => {
      const request = createRequest("/about");

      handle(request);

      expect(mockedResolveCanonical).toHaveBeenCalledWith({
        url: new URL(request.url),
        domain: env.DOMAIN,
        config: requestConfig,
      });
    });

    it("redirects when canonical URL differs", () => {
      const request = createRequest("/about/");

      mockedResolveCanonical.mockReturnValue(new URL(`${origin}/about`));

      const result = handle(request);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.reason).toBe("REDIRECT");
      }
    });

    it("accepts requests already at their canonical URL", () => {
      const request = createRequest("/journal/example");

      const result = handle(request);

      expect(result).toEqual({
        ok: true,
        request,
      });

      if (result.ok) {
        expect(result.request).toBe(request);
      }
    });

    it("preserves query parameters when resolving original URLs", () => {
      const request = createRequest("/journal/example?utm_source=test");

      handle(request);

      expect(mockedResolveCanonical).toHaveBeenCalledWith({
        url: new URL(request.url),
        domain: env.DOMAIN,
        config: requestConfig,
      });
    });
  });

  describe("Error propagation", () => {
    it("propagates redirect resolution errors", () => {
      const request = createRequest("/loop");

      mockedResolveRedirect.mockImplementation(() => {
        throw new Error("Redirect loop detected");
      });

      expect(() => handle(request)).toThrow("Redirect loop detected");

      expect(mockedResolveCanonical).not.toHaveBeenCalled();
    });

    it("propagates canonicalisation errors", () => {
      const request = createRequest("/about");

      mockedResolveCanonical.mockImplementation(() => {
        throw new Error("Invalid canonical domain");
      });

      expect(() => handle(request)).toThrow("Invalid canonical domain");
    });
  });
});
