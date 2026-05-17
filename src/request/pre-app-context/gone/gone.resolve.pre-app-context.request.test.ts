// src/request/pre-app-context/gone/gone.resolve.pre-app-context.request.test.ts

import type { AppState } from "@app-state/class.app-state";
import { preAppContextResolveGone } from "@request/pre-app-context/gone/gone.resolve.pre-app-context.request";

const createRequest = (path: string): Request =>
  new Request(`https://example.com${path}`);

const createAppState = (match: unknown = null) =>
  ({
    getGoneRuleByPath: jest.fn(() => match),
  }) as never as AppState;

describe("preAppContextResolveGone", () => {
  it("returns a 410 error result when a gone rule matches the pathname", () => {
    const appState = createAppState({ fromPath: "/old-page" });

    const result = preAppContextResolveGone(
      createRequest("/old-page"),
      appState,
    );

    expect(result).toEqual({ kind: "error", status: 410 });
    expect(appState.getGoneRuleByPath).toHaveBeenCalledWith("/old-page");
  });

  it("returns null when no gone rule matches the pathname", () => {
    const appState = createAppState(null);

    const result = preAppContextResolveGone(
      createRequest("/active-page"),
      appState,
    );

    expect(result).toBeNull();
    expect(appState.getGoneRuleByPath).toHaveBeenCalledWith("/active-page");
  });

  it("ignores query params when resolving gone rules", () => {
    const appState = createAppState({ fromPath: "/removed" });

    const result = preAppContextResolveGone(
      createRequest("/removed?utm_source=test"),
      appState,
    );

    expect(result).toEqual({ kind: "error", status: 410 });
    expect(appState.getGoneRuleByPath).toHaveBeenCalledWith("/removed");
  });
});
