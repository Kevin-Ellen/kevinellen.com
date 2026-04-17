// tests/src/request/pre-app-context/redirects/system/system.redirects.resolve.pre-app-context.request.test.ts

import { resolveSystemRedirect } from "@request/pre-app-context/redirects/system/system.redirects.resolve.pre-app-context.request";

import type { AppState } from "@app-state/class.app-state";

describe("resolveSystemRedirect", () => {
  it("returns null when no redirect rule matches the pathname", () => {
    const url = new URL("https://dev.kevinellen.com/no-match");

    const appState = {
      getRedirectRuleByPath: jest.fn().mockReturnValue(null),
      siteConfig: {
        origin: "https://dev.kevinellen.com",
      },
    } as unknown as AppState;

    const result = resolveSystemRedirect(url, appState);

    expect(appState.getRedirectRuleByPath).toHaveBeenCalledWith("/no-match");
    expect(result).toBeNull();
  });

  it("returns an internal redirect match for a relative redirect target", () => {
    const url = new URL("https://dev.kevinellen.com/old-path");

    const appState = {
      getRedirectRuleByPath: jest.fn().mockReturnValue({
        fromPath: "/old-path",
        to: "/new-path",
        redirectStatusCode: 301,
      }),
      siteConfig: {
        origin: "https://dev.kevinellen.com",
      },
    } as unknown as AppState;

    const result = resolveSystemRedirect(url, appState);

    expect(appState.getRedirectRuleByPath).toHaveBeenCalledWith("/old-path");
    expect(result).toEqual({
      kind: "redirect",
      redirectMatch: {
        fromPath: "/old-path",
        to: "/new-path",
        redirectStatusCode: 301,
        isInternal: true,
      },
    });
  });

  it("returns an internal redirect match for an absolute redirect target on the same origin", () => {
    const url = new URL("https://dev.kevinellen.com/old-path");

    const appState = {
      getRedirectRuleByPath: jest.fn().mockReturnValue({
        fromPath: "/old-path",
        to: "https://dev.kevinellen.com/new-path",
        redirectStatusCode: 308,
      }),
      siteConfig: {
        origin: "https://dev.kevinellen.com",
      },
    } as unknown as AppState;

    const result = resolveSystemRedirect(url, appState);

    expect(appState.getRedirectRuleByPath).toHaveBeenCalledWith("/old-path");
    expect(result).toEqual({
      kind: "redirect",
      redirectMatch: {
        fromPath: "/old-path",
        to: "https://dev.kevinellen.com/new-path",
        redirectStatusCode: 308,
        isInternal: true,
      },
    });
  });

  it("returns an external redirect match for an absolute redirect target on a different origin", () => {
    const url = new URL("https://dev.kevinellen.com/old-path");

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

    const result = resolveSystemRedirect(url, appState);

    expect(appState.getRedirectRuleByPath).toHaveBeenCalledWith("/old-path");
    expect(result).toEqual({
      kind: "redirect",
      redirectMatch: {
        fromPath: "/old-path",
        to: "https://example.com/new-path",
        redirectStatusCode: 302,
        isInternal: false,
      },
    });
  });

  it("treats an invalid absolute target as external", () => {
    const url = new URL("https://dev.kevinellen.com/old-path");

    const appState = {
      getRedirectRuleByPath: jest.fn().mockReturnValue({
        fromPath: "/old-path",
        to: "ht!tp:// definitely-not-valid",
        redirectStatusCode: 307,
      }),
      siteConfig: {
        origin: "https://dev.kevinellen.com",
      },
    } as unknown as AppState;

    const result = resolveSystemRedirect(url, appState);

    expect(appState.getRedirectRuleByPath).toHaveBeenCalledWith("/old-path");
    expect(result).toEqual({
      kind: "redirect",
      redirectMatch: {
        fromPath: "/old-path",
        to: "ht!tp:// definitely-not-valid",
        redirectStatusCode: 307,
        isInternal: false,
      },
    });
  });
});
