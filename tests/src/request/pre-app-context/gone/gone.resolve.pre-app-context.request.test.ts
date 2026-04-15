// tests/src/request/pre-app-context/gone/gone.resolve.pre-app-context.request.test.ts

import { preAppContextResolveGone } from "@request/pre-app-context/gone/gone.resolve.pre-app-context.request";

import type { AppState } from "@app-state/class.app-state";

describe("preAppContextResolveGone", () => {
  it("returns null when no rules match the pathname", () => {
    const req = new Request("https://dev.kevinellen.com/about");

    const appState = {
      goneRules: [{ path: "/old-page" }],
    } as unknown as AppState;

    const result = preAppContextResolveGone(req, appState);

    expect(result).toBeNull();
  });

  it("returns an error result with status 410 when a rule matches the pathname", () => {
    const req = new Request("https://dev.kevinellen.com/old-page");

    const appState = {
      goneRules: [{ path: "/old-page" }],
    } as unknown as AppState;

    const result = preAppContextResolveGone(req, appState);

    expect(result).toEqual({
      kind: "error",
      status: 410,
    });
  });

  it("matches correctly when multiple rules are present", () => {
    const req = new Request("https://dev.kevinellen.com/b");

    const appState = {
      goneRules: [{ path: "/a" }, { path: "/b" }, { path: "/c" }],
    } as unknown as AppState;

    const result = preAppContextResolveGone(req, appState);

    expect(result).toEqual({
      kind: "error",
      status: 410,
    });
  });

  it("does not match partial paths", () => {
    const req = new Request("https://dev.kevinellen.com/old-page-extra");

    const appState = {
      goneRules: [{ path: "/old-page" }],
    } as unknown as AppState;

    const result = preAppContextResolveGone(req, appState);

    expect(result).toBeNull();
  });
});
