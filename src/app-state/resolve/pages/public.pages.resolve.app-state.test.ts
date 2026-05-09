// src/app-state/resolve/pages/public.pages.resolve.app-state.test.ts

import { appStateResolvePublicPages } from "@app-state/resolve/pages/public.pages.resolve.app-state";

import { loadMergedPublicPageRegistry } from "@app-state/resolve/pages/registries/public.registry.pages.app-state";
import { appStateResolvePublicPage } from "@app-state/resolve/pages/public/public.page.resolve.app-state";

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
    const kv = {} as KVNamespace;

    const authoredPage = {
      id: "journal",
    };

    const resolvedPage = {
      id: "journal",
      status: null,
    };

    const registry = [authoredPage];

    jest
      .mocked(loadMergedPublicPageRegistry)
      .mockResolvedValue(registry as never);

    jest
      .mocked(appStateResolvePublicPage)
      .mockReturnValue(resolvedPage as never);

    await expect(appStateResolvePublicPages({ kv })).resolves.toEqual([
      resolvedPage,
    ]);

    expect(loadMergedPublicPageRegistry).toHaveBeenCalledWith({ kv });

    expect(appStateResolvePublicPage).toHaveBeenCalledWith(
      authoredPage,
      0,
      registry,
    );
  });
});
