// src/request/pre-app-context/redirects/system/system.redirects.resolve.pre-app-context.request.test.ts

import type { AppState } from "@app-state/class.app-state";
import { resolveSystemRedirect } from "@request/pre-app-context/redirects/system/system.redirects.resolve.pre-app-context.request";

const createAppState = (rule: unknown = null, origin = "https://example.com") =>
  ({
    siteConfig: { origin },
    getRedirectRuleByPath: jest.fn(() => rule),
  }) as never as AppState;

describe("resolveSystemRedirect", () => {
  it("returns null when no redirect rule matches", () => {
    const appState = createAppState(null);

    const result = resolveSystemRedirect(
      new URL("https://example.com/current"),
      appState,
    );

    expect(result).toBeNull();
    expect(appState.getRedirectRuleByPath).toHaveBeenCalledWith("/current");
  });

  it("returns an internal redirect for root-relative targets", () => {
    const appState = createAppState({
      fromPath: "/old",
      to: "/new",
      redirectStatusCode: 301,
    });

    const result = resolveSystemRedirect(
      new URL("https://example.com/old"),
      appState,
    );

    expect(result).toEqual({
      kind: "redirect",
      redirectMatch: {
        fromPath: "/old",
        to: "/new",
        redirectStatusCode: 301,
        isInternal: true,
      },
    });
  });

  it("returns an internal redirect for absolute targets on the site origin", () => {
    const appState = createAppState({
      fromPath: "/old",
      to: "https://example.com/new",
      redirectStatusCode: 302,
    });

    const result = resolveSystemRedirect(
      new URL("https://example.com/old"),
      appState,
    );

    expect(result).toEqual({
      kind: "redirect",
      redirectMatch: {
        fromPath: "/old",
        to: "https://example.com/new",
        redirectStatusCode: 302,
        isInternal: true,
      },
    });
  });

  it("returns an external redirect for absolute targets on another origin", () => {
    const appState = createAppState({
      fromPath: "/old",
      to: "https://external.example/new",
      redirectStatusCode: 302,
    });

    const result = resolveSystemRedirect(
      new URL("https://example.com/old"),
      appState,
    );

    expect(result).toEqual({
      kind: "redirect",
      redirectMatch: {
        fromPath: "/old",
        to: "https://external.example/new",
        redirectStatusCode: 302,
        isInternal: false,
      },
    });
  });

  it("treats invalid absolute-looking targets as external", () => {
    const appState = createAppState({
      fromPath: "/old",
      to: "not a url",
      redirectStatusCode: 302,
    });

    const result = resolveSystemRedirect(
      new URL("https://example.com/old"),
      appState,
    );

    expect(result).toMatchObject({
      redirectMatch: {
        isInternal: false,
      },
    });
  });
});
