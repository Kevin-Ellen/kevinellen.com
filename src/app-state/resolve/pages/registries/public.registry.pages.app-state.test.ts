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

  it("merges static, journal KV, and notes KV public page registries", async () => {
    const journalPages = [
      {
        id: "journal:entry-one",
      },
    ];

    const notePages = [
      {
        id: "note:entry-one",
      },
    ];

    jest
      .mocked(loadKvPublicPageRegistry)
      .mockResolvedValueOnce(journalPages as never)
      .mockResolvedValueOnce(notePages as never);

    const journalKv = {} as KVNamespace;
    const notesKv = {} as KVNamespace;

    await expect(
      loadMergedPublicPageRegistry({
        journalKv,
        notesKv,
      }),
    ).resolves.toEqual([
      ...APP_STATE_PAGE_REGISTRY_STATIC_PUBLIC,
      ...journalPages,
      ...notePages,
    ]);

    expect(loadKvPublicPageRegistry).toHaveBeenCalledTimes(2);

    expect(loadKvPublicPageRegistry).toHaveBeenNthCalledWith(1, {
      kv: journalKv,
      prefix: "page:journal:",
    });

    expect(loadKvPublicPageRegistry).toHaveBeenNthCalledWith(2, {
      kv: notesKv,
      prefix: "page:note:",
    });
  });
});
