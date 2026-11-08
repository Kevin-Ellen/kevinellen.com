// src/app/life-cycle/app-resolve/getters/content/kv/kv.content.getter.app-resolve.test.ts

import type { AppInit } from "../../../../app-init/class.app-init";

import { getKvContentAppResolve } from "./kv.content.getter.app-resolve";

type Input = Parameters<typeof getKvContentAppResolve>[0];
type Content = AppInit["content"]["bySlug"][string];

describe("Content KV getter AppResolve", () => {
  const kvGet = jest.fn();

  const kv = {
    get: kvGet,
  } as unknown as KVNamespace;

  const key = "journal:appInit:forest-encounter";
  const expectedId = "forest-encounter";
  const expectedSlug = "/journals/forest-encounter";

  const createContent = (): Content =>
    ({
      id: expectedId,
      kind: "public",
      slug: expectedSlug,
      status: 200,
      metadata: {
        title: "Forest encounter",
        description: "An encounter in the forest.",
        sitemap: true,
      },
      dates: {
        created: "2026-11-06",
        lastUpdated: null,
      },
      body: {},
    }) as unknown as Content;

  const resolve = (overrides: Partial<Input> = {}) =>
    getKvContentAppResolve({
      kv,
      key,
      expectedId,
      expectedSlug,
      ...overrides,
    });

  const expectInvalid = async (content: unknown) => {
    kvGet.mockResolvedValue(content);

    await expect(resolve()).rejects.toThrow(
      `Invalid published content in KV: ${key}`,
    );
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("KV retrieval", () => {
    it("retrieves the expected key as JSON", async () => {
      kvGet.mockResolvedValue(createContent());

      await resolve();

      expect(kvGet).toHaveBeenCalledWith(key, "json");
      expect(kvGet).toHaveBeenCalledTimes(1);
    });

    it("returns not-found when the key is missing", async () => {
      kvGet.mockResolvedValue(null);

      await expect(resolve()).resolves.toEqual({
        kind: "not-found",
        status: 404,
      });
    });

    it("propagates KV retrieval failures", async () => {
      const error = new Error("Cloudflare KV unavailable");

      kvGet.mockRejectedValue(error);

      await expect(resolve()).rejects.toBe(error);
    });

    it("preserves the original content reference", async () => {
      const content = createContent();

      kvGet.mockResolvedValue(content);

      const result = await resolve();

      expect(result).toEqual({
        kind: "found",
        content,
      });

      if (result.kind !== "found") {
        throw new Error("Expected published content");
      }

      expect(result.content).toBe(content);
    });
  });

  describe("Published identity validation", () => {
    it("rejects an unexpected content ID", async () => {
      await expectInvalid({
        ...createContent(),
        id: "another-journal",
      });
    });

    it("rejects an unexpected content slug", async () => {
      await expectInvalid({
        ...createContent(),
        slug: "/journals/another-journal",
      });
    });

    it("rejects a non-public content kind", async () => {
      await expectInvalid({
        ...createContent(),
        kind: "error",
      });
    });

    it("rejects an unexpected HTTP status", async () => {
      await expectInvalid({
        ...createContent(),
        status: 404,
      });
    });

    it("uses the supplied expected identity", async () => {
      const content = {
        ...createContent(),
        id: "second-journal",
        slug: "/journals/second-journal",
      };

      kvGet.mockResolvedValue(content);

      const result = await resolve({
        key: "journal:appInit:second-journal",
        expectedId: "second-journal",
        expectedSlug: "/journals/second-journal",
      });

      expect(result).toEqual({
        kind: "found",
        content,
      });
    });
  });

  describe("Envelope validation", () => {
    it.each([undefined, false, 0, "", "invalid", [], {}])(
      "rejects invalid content: %p",
      async (content) => {
        await expectInvalid(content);
      },
    );

    it.each([
      "id",
      "kind",
      "slug",
      "status",
      "metadata",
      "dates",
      "body",
    ] as const)("rejects a missing %s property", async (field) => {
      const content: Record<string, unknown> = {
        ...createContent(),
      };

      delete content[field];

      await expectInvalid(content);
    });

    it.each([
      ["title", null],
      ["description", 123],
      ["sitemap", "true"],
    ] as const)("rejects invalid metadata.%s", async (field, value) => {
      await expectInvalid({
        ...createContent(),
        metadata: {
          ...createContent().metadata,
          [field]: value,
        },
      });
    });

    it("rejects an invalid metadata container", async () => {
      await expectInvalid({
        ...createContent(),
        metadata: [],
      });
    });

    it.each([
      ["created", null],
      ["lastUpdated", 123],
    ] as const)("rejects invalid dates.%s", async (field, value) => {
      await expectInvalid({
        ...createContent(),
        dates: {
          ...createContent().dates,
          [field]: value,
        },
      });
    });

    it("rejects a missing created date", async () => {
      await expectInvalid({
        ...createContent(),
        dates: {
          lastUpdated: null,
        },
      });
    });

    it("accepts a populated lastUpdated date", async () => {
      const content = {
        ...createContent(),
        dates: {
          created: "2026-11-01",
          lastUpdated: "2026-11-06",
        },
      };

      kvGet.mockResolvedValue(content);

      await expect(resolve()).resolves.toEqual({
        kind: "found",
        content,
      });
    });

    it.each([null, [], "invalid", 42])(
      "rejects an invalid body: %p",
      async (body) => {
        await expectInvalid({
          ...createContent(),
          body,
        });
      },
    );
  });
});
