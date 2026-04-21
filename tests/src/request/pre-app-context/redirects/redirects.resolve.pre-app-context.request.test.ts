// tests/src/request/pre-app-context/redirects/redirects.resolve.pre-app-context.request.test.ts

import { preAppContextResolveRedirects } from "@request/pre-app-context/redirects/redirects.resolve.pre-app-context.request";

import type { AppState } from "@app-state/class.app-state";

describe("preAppContextResolveRedirects", () => {
  it("returns a direct external redirect response immediately", () => {
    const req = new Request("https://dev.kevinellen.com/old-path");

    const appState = {
      getRedirectRuleByPath: jest.fn().mockReturnValue({
        fromPath: "/old-path",
        to: "https://example.com/new-path",
        redirectStatusCode: 302,
      }),
      siteConfig: {
        origin: "https://dev.kevinellen.com",
      },
    } as unknown as AppState;

    const result = preAppContextResolveRedirects(
      req,
      { APP_ENV: "prod" } as Env,
      appState,
    );

    expect(appState.getRedirectRuleByPath).toHaveBeenCalledWith("/old-path");
    expect(result?.kind).toBe("direct-response");

    if (result?.kind !== "direct-response") {
      throw new Error("Expected direct-response result.");
    }

    expect(result.response.status).toBe(302);
    expect(result.response.headers.get("location")).toBe(
      "https://example.com/new-path",
    );
    expect(result.response.headers.get("x-runtime-redirect")).toBe("true");
  });

  it("applies an internal redirect and then canonicalises the final URL", () => {
    const req = new Request("https://dev.kevinellen.com/old-path");

    const appState = {
      getRedirectRuleByPath: jest.fn().mockReturnValue({
        fromPath: "/old-path",
        to: "/New-Path/",
        redirectStatusCode: 301,
      }),
      siteConfig: {
        origin: "https://dev.kevinellen.com",
      },
    } as unknown as AppState;

    const result = preAppContextResolveRedirects(
      req,
      { APP_ENV: "prod" } as Env,
      appState,
    );

    expect(appState.getRedirectRuleByPath).toHaveBeenCalledWith("/old-path");
    expect(result?.kind).toBe("direct-response");

    if (result?.kind !== "direct-response") {
      throw new Error("Expected direct-response result.");
    }

    expect(result.response.status).toBe(301);
    expect(result.response.headers.get("location")).toBe(
      "https://dev.kevinellen.com/new-path",
    );
    expect(result.response.headers.get("x-runtime-redirect")).toBe("true");
  });

  it("returns a canonical-only redirect when no redirect rule matches", () => {
    const req = new Request("http://www.kevinellen.com/About/");

    const appState = {
      getRedirectRuleByPath: jest.fn().mockReturnValue(null),
      siteConfig: {
        origin: "https://kevinellen.com",
      },
    } as unknown as AppState;

    const result = preAppContextResolveRedirects(
      req,
      { APP_ENV: "prod" } as Env,
      appState,
    );

    expect(appState.getRedirectRuleByPath).toHaveBeenCalledWith("/About/");
    expect(result?.kind).toBe("direct-response");

    if (result?.kind !== "direct-response") {
      throw new Error("Expected direct-response result.");
    }

    expect(result.response.status).toBe(308);
    expect(result.response.headers.get("location")).toBe(
      "https://kevinellen.com/about",
    );
    expect(result.response.headers.get("x-runtime-redirect")).toBe("true");
  });

  it("returns null when the request URL is already canonical and no redirect rule matches", () => {
    const req = new Request("https://kevinellen.com/about");

    const appState = {
      getRedirectRuleByPath: jest.fn().mockReturnValue(null),
      siteConfig: {
        origin: "https://kevinellen.com",
      },
    } as unknown as AppState;

    const result = preAppContextResolveRedirects(
      req,
      { APP_ENV: "prod" } as Env,
      appState,
    );

    expect(appState.getRedirectRuleByPath).toHaveBeenCalledWith("/about");
    expect(result).toBeNull();
  });

  it("returns null when an internal redirect target is already identical to the original canonical URL", () => {
    const req = new Request("https://kevinellen.com/about");

    const appState = {
      getRedirectRuleByPath: jest.fn().mockReturnValue({
        fromPath: "/about",
        to: "/about",
        redirectStatusCode: 301,
      }),
      siteConfig: {
        origin: "https://kevinellen.com",
      },
    } as unknown as AppState;

    const result = preAppContextResolveRedirects(
      req,
      { APP_ENV: "prod" } as Env,
      appState,
    );

    expect(appState.getRedirectRuleByPath).toHaveBeenCalledWith("/about");
    expect(result).toBeNull();
  });
});
