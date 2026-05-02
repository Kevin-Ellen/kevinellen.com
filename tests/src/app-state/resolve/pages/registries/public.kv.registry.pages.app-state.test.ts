// tests/src/app-state/resolve/pages/registries/public.kv.registry.pages.app-state.test.ts

import { loadKvPublicPageRegistry } from "@app-state/resolve/pages/registries/public.kv.registry.pages.app-state";

const makeKv = (data: Record<string, unknown>): KVNamespace =>
  ({
    list: jest.fn(({ prefix }: { prefix?: string } = {}) =>
      Promise.resolve({
        keys: Object.keys(data)
          .filter((name) => !prefix || name.startsWith(prefix))
          .map((name) => ({ name })),
      }),
    ),
    get: jest.fn((key: string) => Promise.resolve(data[key] ?? null)),
  }) as unknown as KVNamespace;

describe("loadKvPublicPageRegistry", () => {
  it("returns an empty array when KV has no matching entries", async () => {
    const kv = makeKv({});

    const result = await loadKvPublicPageRegistry({ kv });

    expect(result).toEqual([]);
  });

  it("returns valid authored public page definitions from KV", async () => {
    const page = {
      id: "test-page",
      kind: "journal",
      slug: "/journal/test-page",
      label: "Test Page",
      metadata: {
        pageTitle: "Test Page",
        metaDescription: "Test description",
      },
      breadcrumbs: ["home", "journal"],
      content: {
        header: {
          eyebrow: "Journal",
          title: "Test Page",
          intro: "Intro",
        },
        content: [],
        footer: [],
      },
    };

    const kv = makeKv({
      "page:test-page": page,
    });

    const result = await loadKvPublicPageRegistry({ kv });

    expect(result).toEqual([page]);
  });

  it("filters out invalid KV entries", async () => {
    const kv = makeKv({
      "page:valid": {
        id: "valid",
        kind: "journal",
        slug: "/journal/valid",
        label: "Valid",
        metadata: { pageTitle: "Valid", metaDescription: "Valid" },
        breadcrumbs: ["home"],
        content: { header: {}, content: [], footer: [] },
      },
      "page:invalid": {
        nonsense: true,
      },
    });

    const result = await loadKvPublicPageRegistry({ kv });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("valid");
  });

  it("lists KV keys using the public page prefix", async () => {
    const kv = makeKv({});

    await loadKvPublicPageRegistry({ kv });

    expect(kv.list).toHaveBeenCalledWith({
      prefix: "page:",
    });
  });

  it("filters out null KV values", async () => {
    const kv = makeKv({
      "page:missing": null,
    });

    const result = await loadKvPublicPageRegistry({ kv });

    expect(result).toEqual([]);
  });

  it("filters out non-object KV values", async () => {
    const kv = makeKv({
      "page:string": "not a page",
      "page:number": 123,
    });

    const result = await loadKvPublicPageRegistry({ kv });

    expect(result).toEqual([]);
  });

  it("filters out entries with missing required fields", async () => {
    const invalidEntries = {
      "page:missing-id": {
        kind: "journal",
        slug: "/journal/missing-id",
        label: "Missing ID",
        metadata: {},
        breadcrumbs: [],
        content: {},
      },
      "page:missing-metadata": {
        id: "missing-metadata",
        kind: "journal",
        slug: "/journal/missing-metadata",
        label: "Missing Metadata",
        breadcrumbs: [],
        content: {},
      },
      "page:missing-content": {
        id: "missing-content",
        kind: "journal",
        slug: "/journal/missing-content",
        label: "Missing Content",
        metadata: {},
        breadcrumbs: [],
      },
    };

    const kv = makeKv(invalidEntries);

    const result = await loadKvPublicPageRegistry({ kv });

    expect(result).toEqual([]);
  });
});
