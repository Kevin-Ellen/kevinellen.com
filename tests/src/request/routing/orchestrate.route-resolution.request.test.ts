// tests/src/request/routing/orchestrate.route-resolution.request.test.ts

import { orchestrateRouteResolution } from "@request/routing/orchestrate.route-resolution.request";

import type { AppState } from "@app-state/class.app-state";

jest.mock("@request/routing/resolve.public-route.request", () => ({
  resolvePublicRoute: jest.fn(),
}));

import { resolvePublicRoute } from "@request/routing/resolve.public-route.request";

describe("orchestrateRouteResolution", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns the incoming error result unchanged", () => {
    const req = new Request("https://dev.kevinellen.com/missing");

    const appState = {} as AppState;

    const result = orchestrateRouteResolution(req, appState, {
      kind: "error",
      status: 410,
    });

    expect(resolvePublicRoute).not.toHaveBeenCalled();
    expect(result).toEqual({
      kind: "error",
      status: 410,
    });
  });

  it("resolves the public route when preAppContext continues", () => {
    const req = new Request("https://dev.kevinellen.com/about");

    const appState = {} as AppState;

    (resolvePublicRoute as jest.Mock).mockReturnValue({
      kind: "found",
      publicPageId: "about",
    });

    const result = orchestrateRouteResolution(req, appState, {
      kind: "continue",
    });

    expect(resolvePublicRoute).toHaveBeenCalledWith("/about", appState);
    expect(result).toEqual({
      kind: "found",
      publicPageId: "about",
    });
  });

  it("returns a routing error when the public route resolver returns an error", () => {
    const req = new Request("https://dev.kevinellen.com/missing");

    const appState = {} as AppState;

    (resolvePublicRoute as jest.Mock).mockReturnValue({
      kind: "error",
      status: 404,
    });

    const result = orchestrateRouteResolution(req, appState, {
      kind: "continue",
    });

    expect(resolvePublicRoute).toHaveBeenCalledWith("/missing", appState);
    expect(result).toEqual({
      kind: "error",
      status: 404,
    });
  });
});
