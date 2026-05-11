// src/app-state/resolve/pages/public.pages.resolve.app-state.test.ts

import { appStateResolvePublicPages } from "@app-state/resolve/pages/public.pages.resolve.app-state";
import { appStateResolvePublicPage } from "@app-state/resolve/pages/public/public.page.resolve.app-state";
import { loadMergedPublicPageRegistry } from "@app-state/resolve/pages/registries/public.registry.pages.app-state";

jest.mock(
  "@app-state/resolve/pages/registries/public.registry.pages.app-state",
  () => ({
    loadMergedPublicPageRegistry: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/pages/public/public.page.resolve.app-state",
  () => ({
    appStateResolvePublicPage: jest.fn(),
  }),
);

describe("appStateResolvePublicPages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads and resolves merged public page registry entries", async () => {
    const journalKv = {} as KVNamespace;
    const notesKv = {} as KVNamespace;

    const publicPageRegistry = [
      {
        id: "journal:one",
        kind: "journal",
      },
      {
        id: "note:one",
        kind: "note",
      },
    ];

    const resolvedPages = [
      {
        id: "journal:one",
        kind: "journal",
      },
      {
        id: "note:one",
        kind: "note",
      },
    ];

    jest
      .mocked(loadMergedPublicPageRegistry)
      .mockResolvedValue(publicPageRegistry as never);

    jest
      .mocked(appStateResolvePublicPage)
      .mockReturnValueOnce(resolvedPages[0] as never)
      .mockReturnValueOnce(resolvedPages[1] as never);

    await expect(
      appStateResolvePublicPages({
        journalKv,
        notesKv,
      }),
    ).resolves.toEqual(resolvedPages);

    expect(loadMergedPublicPageRegistry).toHaveBeenCalledWith({
      journalKv,
      notesKv,
    });

    expect(appStateResolvePublicPage).toHaveBeenNthCalledWith(
      1,
      publicPageRegistry[0],
      0,
      publicPageRegistry,
    );

    expect(appStateResolvePublicPage).toHaveBeenNthCalledWith(
      2,
      publicPageRegistry[1],
      1,
      publicPageRegistry,
    );
  });
});
