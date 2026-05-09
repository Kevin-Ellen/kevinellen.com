// src/app-context/resolve/source.resolve.app-context.test.ts

import type { AppState } from "@app-state/class.app-state";
import type { RoutingResult } from "@request/types/request.types";

import { appContextResolvePageSource } from "@app-context/resolve/source.resolve.app-context";

describe("appContextResolvePageSource", () => {
  it("resolves found routes from public pages", () => {
    const page = { id: "journal" };

    const appState = {
      getPublicPageById: jest.fn().mockReturnValue(page),
    } as unknown as AppState;

    const routing: RoutingResult = {
      kind: "found",
      publicPageId: "journal",
      pagination: null,
    };

    expect(appContextResolvePageSource(appState, routing)).toBe(page);
    expect(appState.getPublicPageById).toHaveBeenCalledWith("journal");
  });

  it("throws when a found route public page is missing", () => {
    const appState = {
      getPublicPageById: jest.fn().mockReturnValue(null),
    } as unknown as AppState;

    const routing: RoutingResult = {
      kind: "found",
      publicPageId: "missing",
      pagination: null,
    };

    expect(() => appContextResolvePageSource(appState, routing)).toThrow(
      "Missing public page for routing id 'missing'.",
    );
  });

  it("resolves error routes from status pages", () => {
    const page = { status: 404 };

    const appState = {
      getErrorPageByStatus: jest.fn().mockReturnValue(page),
    } as unknown as AppState;

    const routing: RoutingResult = {
      kind: "error",
      status: 404,
    };

    expect(appContextResolvePageSource(appState, routing)).toBe(page);
    expect(appState.getErrorPageByStatus).toHaveBeenCalledWith(404);
  });

  it("throws when an error route page is missing", () => {
    const appState = {
      getErrorPageByStatus: jest.fn().mockReturnValue(null),
    } as unknown as AppState;

    const routing: RoutingResult = {
      kind: "error",
      status: 500,
    };

    expect(() => appContextResolvePageSource(appState, routing)).toThrow(
      "Missing error page for status '500'.",
    );
  });
});
