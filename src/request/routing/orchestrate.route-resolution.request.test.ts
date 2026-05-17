// src/request/routing/orchestrate.route-resolution.request.test.ts

import { orchestrateRouteResolution } from "@request/routing/orchestrate.route-resolution.request";
import { resolvePublicRoute } from "@request/routing/resolve.public-route.request";

jest.mock("@request/routing/resolve.public-route.request", () => ({
  resolvePublicRoute: jest.fn(),
}));

const createRequest = (path: string): Request =>
  new Request(`https://example.com${path}`);

const createAppState = () => ({}) as never;

describe("orchestrateRouteResolution", () => {
  const mockedResolvePublicRoute = jest.mocked(resolvePublicRoute);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns pre-app-context error without resolving public route", () => {
    const result = orchestrateRouteResolution(
      createRequest("/journal"),
      createAppState(),
      { kind: "error", status: 410 },
    );

    expect(result).toEqual({ kind: "error", status: 410 });
    expect(mockedResolvePublicRoute).not.toHaveBeenCalled();
  });

  it("resolves public route from request pathname when pre-app-context continues", () => {
    const appState = createAppState();
    const routingResult = {
      kind: "found",
      publicPageId: "journal",
      pagination: null,
    } as const;

    mockedResolvePublicRoute.mockReturnValue(routingResult);

    const result = orchestrateRouteResolution(
      createRequest("/journal?ref=test"),
      appState,
      { kind: "continue" },
    );

    expect(result).toBe(routingResult);
    expect(mockedResolvePublicRoute).toHaveBeenCalledWith("/journal", appState);
  });
});
