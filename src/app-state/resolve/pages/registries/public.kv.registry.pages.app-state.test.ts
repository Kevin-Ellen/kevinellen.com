// src/app-state/resolve/pages/registries/public.kv.registry.pages.app-state.test.ts

import { loadKvPublicPageRegistry } from "@app-state/resolve/pages/registries/public.kv.registry.pages.app-state";

describe("loadKvPublicPageRegistry", () => {
  it("loads valid authored public pages from KV page keys", async () => {
    const validPage = {
      id: "journal",
      kind: "listing",
      slug: "/journal",
      label: "Journal",
      metadata: {},
      content: {},
    };

    const kv = {
      list: jest.fn().mockResolvedValue({
        keys: [{ name: "page:journal" }],
      }),
      get: jest.fn().mockResolvedValue(validPage),
    };

    await expect(
      loadKvPublicPageRegistry({ kv: kv as never }),
    ).resolves.toEqual([validPage]);

    expect(kv.list).toHaveBeenCalledWith({ prefix: "page:" });
    expect(kv.get).toHaveBeenCalledWith("page:journal", "json");
  });

  it("filters invalid KV values", async () => {
    const kv = {
      list: jest.fn().mockResolvedValue({
        keys: [
          { name: "page:valid" },
          { name: "page:invalid" },
          { name: "page:null" },
        ],
      }),
      get: jest
        .fn()
        .mockResolvedValueOnce({
          id: "valid",
          kind: "standard",
          slug: "/valid",
          label: "Valid",
          metadata: {},
          breadcrumbs: ["home"],
          content: {},
        })
        .mockResolvedValueOnce({
          id: "invalid",
          kind: "standard",
          slug: "/invalid",
          label: "Invalid",
          metadata: null,
          content: {},
        })
        .mockResolvedValueOnce(null),
    };

    await expect(
      loadKvPublicPageRegistry({ kv: kv as never }),
    ).resolves.toEqual([
      {
        id: "valid",
        kind: "standard",
        slug: "/valid",
        label: "Valid",
        metadata: {},
        breadcrumbs: ["home"],
        content: {},
      },
    ]);
  });

  it("rejects pages with non-array breadcrumbs", async () => {
    const kv = {
      list: jest.fn().mockResolvedValue({
        keys: [{ name: "page:bad-breadcrumbs" }],
      }),
      get: jest.fn().mockResolvedValue({
        id: "bad-breadcrumbs",
        kind: "standard",
        slug: "/bad-breadcrumbs",
        label: "Bad breadcrumbs",
        metadata: {},
        breadcrumbs: "home",
        content: {},
      }),
    };

    await expect(
      loadKvPublicPageRegistry({ kv: kv as never }),
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
      loadKvPublicPageRegistry({ kv: kv as never }),
    ).resolves.toEqual([]);

    expect(kv.get).not.toHaveBeenCalled();
  });
});
