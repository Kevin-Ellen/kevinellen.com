// src/request/pre-app-context/redirects/redirects.resolve.pre-app-context.request.test.ts

import type { AppState } from "@app-state/class.app-state";
import { preAppContextResolveRedirects } from "@request/pre-app-context/redirects/redirects.resolve.pre-app-context.request";

const createEnv = (APP_ENV: Env["APP_ENV"] = "prod"): Env =>
  ({ APP_ENV }) as Env;

const createRequest = (url: string): Request => new Request(url);

const createAppState = (rule: unknown = null) =>
  ({
    siteConfig: {
      origin: "https://example.com",
    },
    getRedirectRuleByPath: jest.fn(() => rule),
  }) as never as AppState;

const expectRedirectResponse = (
  result: ReturnType<typeof preAppContextResolveRedirects>,
): Response => {
  expect(result).toMatchObject({ kind: "direct-response" });

  if (result?.kind !== "direct-response") {
    throw new Error("Expected direct-response result.");
  }

  return result.response;
};

describe("preAppContextResolveRedirects", () => {
  it("returns null when there is no system redirect and URL is already canonical", () => {
    const appState = createAppState();

    const result = preAppContextResolveRedirects(
      createRequest("https://example.com/journal"),
      createEnv("prod"),
      appState,
    );

    expect(result).toBeNull();
    expect(appState.getRedirectRuleByPath).toHaveBeenCalledWith("/journal");
  });

  it("returns a canonical redirect when URL is not canonical", () => {
    const appState = createAppState();

    const result = preAppContextResolveRedirects(
      createRequest("http://www.example.com/Journal/"),
      createEnv("prod"),
      appState,
    );

    const response = expectRedirectResponse(result);

    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe(
      "https://example.com/journal",
    );
    expect(response.headers.get("x-runtime-redirect")).toBe("true");
  });

  it("returns an external system redirect immediately", () => {
    const appState = createAppState({
      fromPath: "/external",
      to: "https://external.example/path",
      redirectStatusCode: 302,
    });

    const result = preAppContextResolveRedirects(
      createRequest("https://example.com/external"),
      createEnv("prod"),
      appState,
    );

    const response = expectRedirectResponse(result);

    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe(
      "https://external.example/path",
    );
    expect(response.headers.get("x-runtime-redirect")).toBe("true");
  });

  it("applies an internal system redirect", () => {
    const appState = createAppState({
      fromPath: "/old",
      to: "/new",
      redirectStatusCode: 301,
    });

    const result = preAppContextResolveRedirects(
      createRequest("https://example.com/old"),
      createEnv("prod"),
      appState,
    );

    const response = expectRedirectResponse(result);

    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe("https://example.com/new");
    expect(response.headers.get("x-runtime-redirect")).toBe("true");
  });

  it("applies canonicalisation after an internal system redirect", () => {
    const appState = createAppState({
      fromPath: "/old",
      to: "/New/",
      redirectStatusCode: 301,
    });

    const result = preAppContextResolveRedirects(
      createRequest("https://example.com/old"),
      createEnv("prod"),
      appState,
    );

    const response = expectRedirectResponse(result);

    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe("https://example.com/new");
  });

  it("uses canonical redirect status when only canonicalisation is needed", () => {
    const appState = createAppState();

    const result = preAppContextResolveRedirects(
      createRequest("https://example.com/Journal"),
      createEnv("prod"),
      appState,
    );

    const response = expectRedirectResponse(result);

    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe(
      "https://example.com/journal",
    );
  });

  it("preserves query params through internal redirect and canonicalisation", () => {
    const appState = createAppState({
      fromPath: "/old",
      to: "/New/",
      redirectStatusCode: 301,
    });

    const result = preAppContextResolveRedirects(
      createRequest("https://example.com/old?ref=test"),
      createEnv("prod"),
      appState,
    );

    const response = expectRedirectResponse(result);

    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe(
      "https://example.com/new?ref=test",
    );
  });

  it("allows internal absolute system redirects on the configured site origin", () => {
    const appState = createAppState({
      fromPath: "/old",
      to: "https://example.com/new",
      redirectStatusCode: 302,
    });

    const result = preAppContextResolveRedirects(
      createRequest("https://example.com/old"),
      createEnv("prod"),
      appState,
    );

    const response = expectRedirectResponse(result);

    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe("https://example.com/new");
  });

  it("does not canonicalise host or protocol outside prod", () => {
    const appState = createAppState();

    const result = preAppContextResolveRedirects(
      createRequest("http://www.example.com/Journal/"),
      createEnv("dev"),
      appState,
    );

    const response = expectRedirectResponse(result);

    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe(
      "http://www.example.com/journal",
    );
  });

  it("does not overwrite query params when internal redirect target has its own query", () => {
    const appState = createAppState({
      fromPath: "/old",
      to: "/New/?source=redirect-rule",
      redirectStatusCode: 301,
    });

    const result = preAppContextResolveRedirects(
      createRequest("https://example.com/old?ref=test"),
      createEnv("prod"),
      appState,
    );

    const response = expectRedirectResponse(result);

    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe(
      "https://example.com/new?source=redirect-rule",
    );
  });
});
