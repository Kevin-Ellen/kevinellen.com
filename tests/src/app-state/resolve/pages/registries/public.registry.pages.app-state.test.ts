// tests/src/app-state/resolve/pages/registries/public.registry.pages.app-state.test.ts

import { loadMergedPublicPageRegistry } from "@app-state/resolve/pages/registries/public.registry.pages.app-state";

jest.mock(
  "@app-state/resolve/pages/registries/public.kv.registry.pages.app-state",
  () => ({
    loadKvPublicPageRegistry: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/pages/registries/public.static.registry.pages.app-state",
  () => ({
    APP_STATE_PAGE_REGISTRY_STATIC_PUBLIC: [{ id: "static-1" }],
  }),
);

import { loadKvPublicPageRegistry } from "@app-state/resolve/pages/registries/public.kv.registry.pages.app-state";

const mockedLoadKvPublicPageRegistry = jest.mocked(loadKvPublicPageRegistry);

describe("loadMergedPublicPageRegistry", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("merges static and KV public page registries in the correct order", async () => {
    const kv = {} as KVNamespace;
    const kvPages = [{ id: "kv-1" }] as never[];

    mockedLoadKvPublicPageRegistry.mockResolvedValue(kvPages);

    const result = await loadMergedPublicPageRegistry({ kv });

    expect(result).toEqual([{ id: "static-1" }, ...kvPages]);
    expect(mockedLoadKvPublicPageRegistry).toHaveBeenCalledWith({ kv });
  });
});
