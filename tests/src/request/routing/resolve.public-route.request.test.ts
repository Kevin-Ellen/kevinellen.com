// tests/src/request/routing/resolve.public-route.request.test.ts

import { resolvePublicRoute } from "@request/routing/resolve.public-route.request";

import type { AppState } from "@app-state/class.app-state";

describe("resolvePublicRoute", () => {
  it("returns found when a public page matches the pathname", () => {
    const appState = {
      getPublicPageBySlug: jest.fn().mockReturnValue({
        id: "home",
        slug: "/",
      }),
    } as unknown as AppState;

    const result = resolvePublicRoute("/", appState);

    expect(appState.getPublicPageBySlug).toHaveBeenCalledWith("/");
    expect(result).toEqual({
      kind: "found",
      publicPageId: "home",
    });
  });

  it("returns error 404 when no public page matches the pathname", () => {
    const appState = {
      getPublicPageBySlug: jest.fn().mockReturnValue(null),
    } as unknown as AppState;

    const result = resolvePublicRoute("/missing", appState);

    expect(appState.getPublicPageBySlug).toHaveBeenCalledWith("/missing");
    expect(result).toEqual({
      kind: "error",
      status: 404,
    });
  });
});
