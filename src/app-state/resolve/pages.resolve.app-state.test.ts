// src/app-state/resolve/pages.resolve.app-state.test.ts

import { appStateResolvePages } from "@app-state/resolve/pages.resolve.app-state";
import { appStateResolvePublicPages } from "@app-state/resolve/pages/public.pages.resolve.app-state";
import { appStateResolveErrorPages } from "@app-state/resolve/pages/error.pages.resolve.app-state";

jest.mock("@app-state/resolve/pages/public.pages.resolve.app-state", () => ({
  appStateResolvePublicPages: jest.fn(),
}));

jest.mock("@app-state/resolve/pages/error.pages.resolve.app-state", () => ({
  appStateResolveErrorPages: jest.fn(),
}));

describe("appStateResolvePages", () => {
  it("resolves public and error pages", async () => {
    const journalKv = {} as KVNamespace;
    const notesKv = {} as KVNamespace;

    const publicPages = [{ id: "home" }];
    const errorPages = [{ id: "not-found" }];

    jest
      .mocked(appStateResolvePublicPages)
      .mockResolvedValue(publicPages as never);
    jest.mocked(appStateResolveErrorPages).mockReturnValue(errorPages as never);

    await expect(appStateResolvePages({ journalKv, notesKv })).resolves.toEqual(
      {
        public: publicPages,
        error: errorPages,
      },
    );

    expect(appStateResolvePublicPages).toHaveBeenCalledWith({
      journalKv,
      notesKv,
    });
    expect(appStateResolveErrorPages).toHaveBeenCalledWith();
  });
});
