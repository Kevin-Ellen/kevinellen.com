// src/shared/resolvers/content/modules/journal-listing/journal-listing.module.content.resolver.shared.app-init.test.ts

import { resolveJournalListingModuleAppInit } from "./journal-listing.module.content.resolver.shared.app-init";

type Authored = Parameters<
  typeof resolveJournalListingModuleAppInit
>[0]["authored"];

describe("Journal listing module AppInit resolver", () => {
  const createAuthored = (overrides: Partial<Authored> = {}): Authored =>
    ({
      kind: "journalListing",
      pageSize: 12,
      photoLimit: 3,
      ...overrides,
    }) as unknown as Authored;

  const resolve = (authored: Authored) =>
    resolveJournalListingModuleAppInit({ authored });

  describe("Default values", () => {
    it("applies all optional defaults", () => {
      const result = resolve(createAuthored());

      expect(result).toMatchObject({
        eyebrow: "Latest entry",
        pagination: true,
        displayFeatured: true,
        showViewAllLink: false,
        topicId: null,
      });
    });

    it("preserves required numeric values", () => {
      const result = resolve(
        createAuthored({
          pageSize: 24,
          photoLimit: 5,
        }),
      );

      expect(result.pageSize).toBe(24);
      expect(result.photoLimit).toBe(5);
    });

    it("normalises explicitly undefined options", () => {
      const result = resolve(
        createAuthored({
          eyebrow: undefined,
          pagination: undefined,
          displayFeatured: undefined,
          showViewAllLink: undefined,
          topicId: undefined,
        }),
      );

      expect(result).toMatchObject({
        eyebrow: "Latest entry",
        pagination: true,
        displayFeatured: true,
        showViewAllLink: false,
        topicId: null,
      });
    });
  });

  describe("Explicit overrides", () => {
    it("preserves a custom eyebrow", () => {
      const result = resolve(
        createAuthored({
          eyebrow: "Field notes",
        }),
      );

      expect(result.eyebrow).toBe("Field notes");
    });

    it("preserves explicitly disabled pagination", () => {
      const result = resolve(
        createAuthored({
          pagination: false,
        }),
      );

      expect(result.pagination).toBe(false);
    });

    it("preserves explicitly disabled featured content", () => {
      const result = resolve(
        createAuthored({
          displayFeatured: false,
        }),
      );

      expect(result.displayFeatured).toBe(false);
    });

    it("preserves an explicitly enabled view-all link", () => {
      const result = resolve(
        createAuthored({
          showViewAllLink: true,
        }),
      );

      expect(result.showViewAllLink).toBe(true);
    });

    it("preserves an authored topic ID", () => {
      const result = resolve(
        createAuthored({
          topicId: "essex",
        }),
      );

      expect(result.topicId).toBe("essex");
    });

    it("supports another registered topic ID", () => {
      const result = resolve(
        createAuthored({
          topicId: "raptors",
        }),
      );

      expect(result.topicId).toBe("raptors");
    });

    it("preserves all explicit settings together", () => {
      const result = resolve(
        createAuthored({
          eyebrow: "Essex journals",
          pagination: false,
          displayFeatured: false,
          showViewAllLink: true,
          topicId: "essex",
        }),
      );

      expect(result).toMatchObject({
        eyebrow: "Essex journals",
        pagination: false,
        displayFeatured: false,
        showViewAllLink: true,
        topicId: "essex",
      });
    });
  });

  describe("Page size validation", () => {
    it.each([
      0,
      -1,
      -10,
      1.5,
      NaN,
      Infinity,
      -Infinity,
      Number.MAX_SAFE_INTEGER + 1,
    ])("rejects invalid pageSize %s", (pageSize) => {
      expect(() =>
        resolve(
          createAuthored({
            pageSize,
          }),
        ),
      ).toThrow("Journal listing pageSize must be a positive integer");
    });

    it("accepts the minimum valid page size", () => {
      const result = resolve(
        createAuthored({
          pageSize: 1,
        }),
      );

      expect(result.pageSize).toBe(1);
    });

    it("accepts the maximum safe integer", () => {
      const result = resolve(
        createAuthored({
          pageSize: Number.MAX_SAFE_INTEGER,
        }),
      );

      expect(result.pageSize).toBe(Number.MAX_SAFE_INTEGER);
    });
  });

  describe("Photo limit validation", () => {
    it.each([
      0,
      -1,
      -10,
      1.5,
      NaN,
      Infinity,
      -Infinity,
      Number.MAX_SAFE_INTEGER + 1,
    ])("rejects invalid photoLimit %s", (photoLimit) => {
      expect(() =>
        resolve(
          createAuthored({
            photoLimit,
          }),
        ),
      ).toThrow("Journal listing photoLimit must be a positive integer");
    });

    it("accepts the minimum valid photo limit", () => {
      const result = resolve(
        createAuthored({
          photoLimit: 1,
        }),
      );

      expect(result.photoLimit).toBe(1);
    });

    it("accepts the maximum safe integer", () => {
      const result = resolve(
        createAuthored({
          photoLimit: Number.MAX_SAFE_INTEGER,
        }),
      );

      expect(result.photoLimit).toBe(Number.MAX_SAFE_INTEGER);
    });

    it("validates pageSize before photoLimit", () => {
      expect(() =>
        resolve(
          createAuthored({
            pageSize: 0,
            photoLimit: 0,
          }),
        ),
      ).toThrow("Journal listing pageSize must be a positive integer");
    });
  });

  describe("Data integrity", () => {
    it("does not mutate authored configuration", () => {
      const authored = createAuthored({
        topicId: "travel",
      });

      const original = { ...authored };

      resolve(authored);

      expect(authored).toEqual(original);
    });

    it("returns a new object", () => {
      const authored = createAuthored();

      expect(resolve(authored)).not.toBe(authored);
    });

    it("preserves unrelated authored properties", () => {
      const authored = {
        ...createAuthored(),
        identifier: "journal-index",
      };

      const result = resolve(authored);

      expect(result).toMatchObject({
        identifier: "journal-index",
      });
    });

    it("supports frozen authored configuration", () => {
      const authored = Object.freeze(createAuthored());

      const result = resolve(authored);

      expect(result.pageSize).toBe(12);
      expect(result.photoLimit).toBe(3);
    });
  });
});
