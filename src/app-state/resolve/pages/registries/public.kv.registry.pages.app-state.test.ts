// src/app-state/resolve/pages/registries/public.kv.registry.pages.app-state.test.ts

import { loadKvPublicPageRegistry } from "@app-state/resolve/pages/registries/public.kv.registry.pages.app-state";

describe("loadKvPublicPageRegistry", () => {
  const prefix = "page:journal:";

  it("loads valid authored public pages from KV page keys", async () => {
    const validPage = {
      id: "journal:entry-one",
      kind: "journal",
      slug: "/journal/entry-one",
      label: "Entry one",
      metadata: {},
      breadcrumbs: ["home"],
      content: {},
    };

    const kv = {
      list: jest.fn().mockResolvedValue({
        keys: [{ name: "page:journal:entry-one" }],
      }),
      get: jest.fn().mockResolvedValue(validPage),
    };

    await expect(
      loadKvPublicPageRegistry({
        kv: kv as never,
        prefix,
      }),
    ).resolves.toEqual([validPage]);

    expect(kv.list).toHaveBeenCalledWith({ prefix });
    expect(kv.get).toHaveBeenCalledWith("page:journal:entry-one", "json");
  });

  it("uses the supplied prefix when listing KV keys", async () => {
    const kv = {
      list: jest.fn().mockResolvedValue({
        keys: [],
      }),
      get: jest.fn(),
    };

    await loadKvPublicPageRegistry({
      kv: kv as never,
      prefix: "page:note:",
    });

    expect(kv.list).toHaveBeenCalledWith({ prefix: "page:note:" });
  });

  it("filters invalid KV values", async () => {
    const validPage = {
      id: "journal:valid",
      kind: "journal",
      slug: "/journal/valid",
      label: "Valid",
      metadata: {},
      breadcrumbs: ["home"],
      content: {},
    };

    const kv = {
      list: jest.fn().mockResolvedValue({
        keys: [
          { name: "page:journal:valid" },
          { name: "page:journal:invalid" },
          { name: "page:journal:null" },
        ],
      }),
      get: jest
        .fn()
        .mockResolvedValueOnce(validPage)
        .mockResolvedValueOnce({
          id: "journal:invalid",
          kind: "journal",
          slug: "/journal/invalid",
          label: "Invalid",
          metadata: null,
          breadcrumbs: ["home"],
          content: {},
        })
        .mockResolvedValueOnce(null),
    };

    await expect(
      loadKvPublicPageRegistry({
        kv: kv as never,
        prefix,
      }),
    ).resolves.toEqual([validPage]);
  });

  it("rejects pages with non-array breadcrumbs", async () => {
    const kv = {
      list: jest.fn().mockResolvedValue({
        keys: [{ name: "page:journal:bad-breadcrumbs" }],
      }),
      get: jest.fn().mockResolvedValue({
        id: "journal:bad-breadcrumbs",
        kind: "journal",
        slug: "/journal/bad-breadcrumbs",
        label: "Bad breadcrumbs",
        metadata: {},
        breadcrumbs: "home",
        content: {},
      }),
    };

    await expect(
      loadKvPublicPageRegistry({
        kv: kv as never,
        prefix,
      }),
    ).resolves.toEqual([]);
  });

  it("returns an empty array when no page keys are found", async () => {
    const kv = {
      list: jest.fn().mockResolvedValue({
        keys: [],
      }),
      get: jest.fn(),
    };

    await expect(
      loadKvPublicPageRegistry({
        kv: kv as never,
        prefix,
      }),
    ).resolves.toEqual([]);

    expect(kv.get).not.toHaveBeenCalled();
  });
});
