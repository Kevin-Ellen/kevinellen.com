// tests/src/app/policies/request/resolution/evaluate.redirect.request.resolution.test.ts

import { AppState } from "@app/appState/class.appState";
import { evaluateRedirectRequestResolution } from "@app/policies/request/resolution/evaluate.redirect.request.resolution";

import { homePage } from "@app/pages/public/home.page";
import { error404Page } from "@app/pages/error/404.error.page";

import { createAppStateConfig } from "@tests/helpers/appState/create.config.appState";

describe("evaluateRedirectRequestResolution", () => {
  const createAppState = (
    redirectsConfig: readonly {
      fromPath: string;
      to: string;
      redirectStatusCode: 301 | 302 | 307 | 308;
    }[] = [],
  ): AppState => {
    const config = createAppStateConfig({
      publicPages: [homePage],
      errorPages: [error404Page],
      redirectsConfig,
    });

    return new AppState(config);
  };

  const createRequest = (pathname: string): Request =>
    new Request(`https://kevinellen.com${pathname}`);

  it("returns continue when no redirect rule matches", () => {
    const appState = createAppState([
      {
        fromPath: "/old-page",
        to: "/new-page",
        redirectStatusCode: 301,
      },
    ]);

    const outcome = evaluateRedirectRequestResolution(
      createRequest("/missing-page"),
      appState,
    );

    expect(outcome).toEqual({ kind: "continue" });
  });

  it("returns redirect for an internal relative redirect target", () => {
    const appState = createAppState([
      {
        fromPath: "/old-page",
        to: "/new-page",
        redirectStatusCode: 301,
      },
    ]);

    const outcome = evaluateRedirectRequestResolution(
      createRequest("/old-page"),
      appState,
    );

    expect(outcome).toEqual({
      kind: "redirect",
      location: "/new-page",
      status: 301,
    });
  });

  it("returns redirect for an internal absolute redirect target on the site origin", () => {
    const appState = createAppState([
      {
        fromPath: "/old-page",
        to: "https://kevinellen.com/new-page",
        redirectStatusCode: 308,
      },
    ]);

    const outcome = evaluateRedirectRequestResolution(
      createRequest("/old-page"),
      appState,
    );

    expect(outcome).toEqual({
      kind: "redirect",
      location: "https://kevinellen.com/new-page",
      status: 308,
    });
  });

  it("returns direct-response for an external redirect target", async () => {
    const appState = createAppState([
      {
        fromPath: "/old-page",
        to: "https://example.com/new-page",
        redirectStatusCode: 302,
      },
    ]);

    const outcome = evaluateRedirectRequestResolution(
      createRequest("/old-page"),
      appState,
    );

    expect(outcome.kind).toBe("direct-response");

    if (outcome.kind !== "direct-response") {
      throw new Error("Expected direct-response outcome");
    }

    expect(outcome.response.status).toBe(302);
    expect(outcome.response.headers.get("location")).toBe(
      "https://example.com/new-page",
    );
    expect(outcome.response.headers.get("x-runtime-policy")).toBe("redirect");
    expect(await outcome.response.text()).toBe("");
  });

  it("treats malformed absolute-looking targets as external direct responses", async () => {
    const appState = createAppState([
      {
        fromPath: "/old-page",
        to: "not a valid url",
        redirectStatusCode: 301,
      },
    ]);

    const outcome = evaluateRedirectRequestResolution(
      createRequest("/old-page"),
      appState,
    );

    expect(outcome.kind).toBe("direct-response");

    if (outcome.kind !== "direct-response") {
      throw new Error("Expected direct-response outcome");
    }

    expect(outcome.response.status).toBe(301);
    expect(outcome.response.headers.get("location")).toBe("not a valid url");
    expect(outcome.response.headers.get("x-runtime-policy")).toBe("redirect");
    expect(await outcome.response.text()).toBe("");
  });

  it("matches pathname only and ignores query strings on the request", () => {
    const appState = createAppState([
      {
        fromPath: "/old-page",
        to: "/new-page",
        redirectStatusCode: 301,
      },
    ]);

    const request = new Request("https://kevinellen.com/old-page?ref=test");

    const outcome = evaluateRedirectRequestResolution(request, appState);

    expect(outcome).toEqual({
      kind: "redirect",
      location: "/new-page",
      status: 301,
    });
  });
});
