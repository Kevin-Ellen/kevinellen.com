// tests/src/app-state/resolve/pages.resolve.app-state.test.ts

describe("appStateResolvePages", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("composes public and error pages from their resolvers", async () => {
    const kv = {} as KVNamespace;
    const publicPages = [{ id: "home" }];
    const errorPages = [{ id: "error-404" }];

    const resolvePublicPagesMock = jest.fn().mockResolvedValue(publicPages);
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

    const result = await appStateResolvePages({ kv });

    expect(result).toEqual({
      public: publicPages,
      error: errorPages,
    });

    expect(resolvePublicPagesMock).toHaveBeenCalledWith({ kv });
    expect(resolveErrorPagesMock).toHaveBeenCalledTimes(1);
  });
});
