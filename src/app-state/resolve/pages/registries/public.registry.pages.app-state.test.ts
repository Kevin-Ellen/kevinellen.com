// src/app-state/resolve/pages/registries/public.registry.pages.app-state.test.ts

import { loadMergedPublicPageRegistry } from "@app-state/resolve/pages/registries/public.registry.pages.app-state";

import { loadKvPublicPageRegistry } from "@app-state/resolve/pages/registries/public.kv.registry.pages.app-state";
import { APP_STATE_PAGE_REGISTRY_STATIC_PUBLIC } from "@app-state/resolve/pages/registries/public.static.registry.pages.app-state";

jest.mock(
  "@app-state/resolve/pages/registries/public.kv.registry.pages.app-state",
  () => ({
    loadKvPublicPageRegistry: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/pages/registries/public.static.registry.pages.app-state",
  () => ({
    APP_STATE_PAGE_REGISTRY_STATIC_PUBLIC: [
      {
        id: "home",
      },
    ],
  }),
);

describe("loadMergedPublicPageRegistry", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("merges static and KV public page registries", async () => {
    const kvPages = [
      {
        id: "journal",
      },
    ];

    jest.mocked(loadKvPublicPageRegistry).mockResolvedValue(kvPages as never);

    const kv = {} as KVNamespace;

    await expect(loadMergedPublicPageRegistry({ kv })).resolves.toEqual([
      ...APP_STATE_PAGE_REGISTRY_STATIC_PUBLIC,
      ...kvPages,
    ]);

    expect(loadKvPublicPageRegistry).toHaveBeenCalledWith({
      kv,
    });
  });
});
