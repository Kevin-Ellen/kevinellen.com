// tests/src/request/pre-app-context/gone/gone.resolve.pre-app-context.request.test.ts

import { preAppContextResolveGone } from "@request/pre-app-context/gone/gone.resolve.pre-app-context.request";

import type { AppState } from "@app-state/class.app-state";

describe("preAppContextResolveGone", () => {
  it("returns null when no rules match the pathname", () => {
    const req = new Request("https://dev.kevinellen.com/about");

    const appState = {
      getGoneRuleByPath: jest.fn().mockReturnValue(null),
    } as unknown as AppState;

    const result = preAppContextResolveGone(req, appState);

    expect(appState.getGoneRuleByPath).toHaveBeenCalledWith("/about");
    expect(result).toBeNull();
  });

  it("returns an error result with status 410 when a rule matches the pathname", () => {
    const req = new Request("https://dev.kevinellen.com/old-page");

    const appState = {
      getGoneRuleByPath: jest.fn().mockReturnValue({ path: "/old-page" }),
    } as unknown as AppState;

    const result = preAppContextResolveGone(req, appState);

    expect(appState.getGoneRuleByPath).toHaveBeenCalledWith("/old-page");
    expect(result).toEqual({
      kind: "error",
      status: 410,
    });
  });

  it("returns an error result with status 410 when a matching rule is found", () => {
    const req = new Request("https://dev.kevinellen.com/b");

    const appState = {
      getGoneRuleByPath: jest.fn().mockReturnValue({ path: "/b" }),
    } as unknown as AppState;

    const result = preAppContextResolveGone(req, appState);

    expect(appState.getGoneRuleByPath).toHaveBeenCalledWith("/b");
    expect(result).toEqual({
      kind: "error",
      status: 410,
    });
  });

  it("returns null when the lookup does not find an exact path match", () => {
    const req = new Request("https://dev.kevinellen.com/old-page-extra");

    const appState = {
      getGoneRuleByPath: jest.fn().mockReturnValue(null),
    } as unknown as AppState;

    const result = preAppContextResolveGone(req, appState);

    expect(appState.getGoneRuleByPath).toHaveBeenCalledWith("/old-page-extra");
    expect(result).toBeNull();
  });
});
