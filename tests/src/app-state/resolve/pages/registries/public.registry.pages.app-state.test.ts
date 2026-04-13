// tests/src/app-state/resolve/pages/registries/public.registry.pages.app-state.test.ts

describe("APP_STATE_PAGE_REGISTRY_PUBLIC_MERGED", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("merges KV and static public page registries in the correct order (KV first)", async () => {
    const kvPages = [{ id: "kv-1" }] as never[];
    const staticPages = [{ id: "static-1" }] as never[];

    jest.doMock(
      "@app-state/resolve/pages/registries/public.kv.registry.pages.app-state",
      () => ({
        APP_STATE_PAGE_REGISTRY_KV_PUBLIC: kvPages,
      }),
    );

    jest.doMock(
      "@app-state/resolve/pages/registries/public.static.registry.pages.app-state",
      () => ({
        APP_STATE_PAGE_REGISTRY_STATIC_PUBLIC: staticPages,
      }),
    );

    const { APP_STATE_PAGE_REGISTRY_PUBLIC_MERGED } =
      await import("@app-state/resolve/pages/registries/public.registry.pages.app-state");

    expect(APP_STATE_PAGE_REGISTRY_PUBLIC_MERGED).toEqual([
      ...kvPages,
      ...staticPages,
    ]);
  });

  it("preserves ordering: KV pages come before static pages", async () => {
    const kvPages = [{ id: "kv-1" }, { id: "kv-2" }] as never[];
    const staticPages = [{ id: "static-1" }] as never[];

    jest.doMock(
      "@app-state/resolve/pages/registries/public.kv.registry.pages.app-state",
      () => ({
        APP_STATE_PAGE_REGISTRY_KV_PUBLIC: kvPages,
      }),
    );

    jest.doMock(
      "@app-state/resolve/pages/registries/public.static.registry.pages.app-state",
      () => ({
        APP_STATE_PAGE_REGISTRY_STATIC_PUBLIC: staticPages,
      }),
    );

    const { APP_STATE_PAGE_REGISTRY_PUBLIC_MERGED } =
      await import("@app-state/resolve/pages/registries/public.registry.pages.app-state");

    expect(APP_STATE_PAGE_REGISTRY_PUBLIC_MERGED[0]).toBe(kvPages[0]);
    expect(APP_STATE_PAGE_REGISTRY_PUBLIC_MERGED[1]).toBe(kvPages[1]);
    expect(APP_STATE_PAGE_REGISTRY_PUBLIC_MERGED[2]).toBe(staticPages[0]);
  });

  it("does not mutate the source registries", async () => {
    const kvPages = [{ id: "kv-1" }] as never[];
    const staticPages = [{ id: "static-1" }] as never[];

    jest.doMock(
      "@app-state/resolve/pages/registries/public.kv.registry.pages.app-state",
      () => ({
        APP_STATE_PAGE_REGISTRY_KV_PUBLIC: kvPages,
      }),
    );

    jest.doMock(
      "@app-state/resolve/pages/registries/public.static.registry.pages.app-state",
      () => ({
        APP_STATE_PAGE_REGISTRY_STATIC_PUBLIC: staticPages,
      }),
    );

    const { APP_STATE_PAGE_REGISTRY_PUBLIC_MERGED } =
      await import("@app-state/resolve/pages/registries/public.registry.pages.app-state");

    expect(kvPages).toEqual([{ id: "kv-1" }]);
    expect(staticPages).toEqual([{ id: "static-1" }]);

    expect(APP_STATE_PAGE_REGISTRY_PUBLIC_MERGED).not.toBe(kvPages);
    expect(APP_STATE_PAGE_REGISTRY_PUBLIC_MERGED).not.toBe(staticPages);
  });

  it("handles empty KV registry (current state)", async () => {
    const staticPages = [{ id: "static-1" }] as never[];

    jest.doMock(
      "@app-state/resolve/pages/registries/public.kv.registry.pages.app-state",
      () => ({
        APP_STATE_PAGE_REGISTRY_KV_PUBLIC: [],
      }),
    );

    jest.doMock(
      "@app-state/resolve/pages/registries/public.static.registry.pages.app-state",
      () => ({
        APP_STATE_PAGE_REGISTRY_STATIC_PUBLIC: staticPages,
      }),
    );

    const { APP_STATE_PAGE_REGISTRY_PUBLIC_MERGED } =
      await import("@app-state/resolve/pages/registries/public.registry.pages.app-state");

    expect(APP_STATE_PAGE_REGISTRY_PUBLIC_MERGED).toEqual(staticPages);
  });
});
