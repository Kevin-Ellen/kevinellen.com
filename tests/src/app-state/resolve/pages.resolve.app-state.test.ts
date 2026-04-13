// tests/src/app-state/resolve/pages.resolve.app-state.test.ts

describe("appStateResolvePages", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("composes public and error pages from their resolvers", async () => {
    const publicPages = [{ id: "home" }];
    const errorPages = [{ id: "error-404" }];

    const resolvePublicPagesMock = jest.fn(() => publicPages);
    const resolveErrorPagesMock = jest.fn(() => errorPages);

    jest.doMock(
      "@app-state/resolve/pages/public.pages.resolve.app-state",
      () => ({
        appStateResolvePublicPages: resolvePublicPagesMock,
      }),
    );

    jest.doMock(
      "@app-state/resolve/pages/error.pages.resolve.app-state",
      () => ({
        appStateResolveErrorPages: resolveErrorPagesMock,
      }),
    );

    const { appStateResolvePages } =
      await import("@app-state/resolve/pages.resolve.app-state");

    expect(appStateResolvePages).toEqual({
      public: publicPages,
      error: errorPages,
    });

    expect(resolvePublicPagesMock).toHaveBeenCalledTimes(1);
    expect(resolveErrorPagesMock).toHaveBeenCalledTimes(1);
  });
});
