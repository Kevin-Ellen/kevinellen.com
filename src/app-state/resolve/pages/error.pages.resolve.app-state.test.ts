// src/app-state/resolve/pages/error.pages.resolve.app-state.test.ts

import { appStateResolveErrorPages } from "@app-state/resolve/pages/error.pages.resolve.app-state";

import { APP_STATE_PAGE_REGISTRY_STATIC_ERROR } from "@app-state/resolve/pages/registries/error.static.registry.pages.app-state";
import { appStateResolveErrorPage } from "@app-state/resolve/pages/error/error.page.resolve.app-state";

jest.mock(
  "@app-state/resolve/pages/registries/error.static.registry.pages.app-state",
  () => ({
    APP_STATE_PAGE_REGISTRY_STATIC_ERROR: [{ id: "not-found" }],
  }),
);

jest.mock(
  "@app-state/resolve/pages/error/error.page.resolve.app-state",
  () => ({
    appStateResolveErrorPage: jest.fn(),
  }),
);

describe("appStateResolveErrorPages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves static error page registry entries", () => {
    const resolvedPage = {
      id: "not-found",
      status: 404,
    };

    jest
      .mocked(appStateResolveErrorPage)
      .mockReturnValue(resolvedPage as never);

    expect(appStateResolveErrorPages()).toEqual([resolvedPage]);

    expect(appStateResolveErrorPage).toHaveBeenCalledWith(
      APP_STATE_PAGE_REGISTRY_STATIC_ERROR[0],
      0,
      APP_STATE_PAGE_REGISTRY_STATIC_ERROR,
    );
  });
});
