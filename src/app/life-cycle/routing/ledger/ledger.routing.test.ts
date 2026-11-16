// src/app/life-cycle/routing/ledger/ledger.routing.test.ts

import type { ValidatedEnv } from "../../../entry.type";

import type {
  JournalLedgerAppInit,
  JournalLedgerEntryAppInit,
} from "../../../../shared/types/content/kv-ledger.content.shared.type";

import { resolveJournalLedgerRouting } from "./ledger.routing";

describe("Journal ledger routing", () => {
  const kvGet = jest.fn();

  const env = {
    CONTENT_KV: {
      get: kvGet,
    },
  } as unknown as ValidatedEnv;

  const invalidLedgerError = "Invalid published journal AppInit ledger";

  const createEntry = (
    slug: string,
    dateCreated: string,
  ): JournalLedgerEntryAppInit => ({
    id: slug,
    kind: "journal",
    slug,
    dateCreated,
    label: "Test journal",
    sitemap: true,
    breadcrumbs: [],
    title: "Test journal",
    intro: "Journal entry for testing.",
    photos: [],
    topics: [],
  });

  const createLedger = (
    entries: readonly JournalLedgerEntryAppInit[],
  ): JournalLedgerAppInit => ({
    version: 2,
    entries,
  });

  const resolve = () => resolveJournalLedgerRouting({ env });

  const expectInvalidLedger = async (ledger: unknown): Promise<void> => {
    kvGet.mockResolvedValue(ledger);

    await expect(resolve()).rejects.toThrow(invalidLedgerError);
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("KV retrieval", () => {
    it("retrieves the published journal ledger from KV", async () => {
      kvGet.mockResolvedValue(createLedger([]));

      await resolve();

      expect(kvGet).toHaveBeenCalledWith("ledger:appInit:journal", "json");
      expect(kvGet).toHaveBeenCalledTimes(1);
    });

    it("throws when the ledger does not exist", async () => {
      kvGet.mockResolvedValue(null);

      await expect(resolve()).rejects.toThrow(
        "Published journal AppInit ledger not found",
      );
    });

    it("propagates KV retrieval failures", async () => {
      const error = new Error("Cloudflare KV unavailable");

      kvGet.mockRejectedValue(error);

      await expect(resolve()).rejects.toBe(error);
    });
  });

  describe("Ledger envelope validation", () => {
    it.each([0, 1, 3])(
      "rejects unsupported ledger version %i",
      async (version) => {
        await expectInvalidLedger({ version, entries: [] });
      },
    );

    it.each([undefined, false, 0, "", "invalid", [], {}])(
      "rejects an invalid ledger envelope: %p",
      async (value) => {
        await expectInvalidLedger(value);
      },
    );

    it("rejects a ledger without a version", async () => {
      await expectInvalidLedger({ entries: [] });
    });

    it("rejects a ledger without an entries array", async () => {
      await expectInvalidLedger({ version: 2, entries: null });
    });

    it.each([undefined, "invalid", {}, 0, false])(
      "rejects an invalid entries value: %p",
      async (entries) => {
        await expectInvalidLedger({ version: 2, entries });
      },
    );

    it("rejects an entries array containing null", async () => {
      await expectInvalidLedger({ version: 2, entries: [null] });
    });

    it("rejects an entries array containing a primitive", async () => {
      await expectInvalidLedger({ version: 2, entries: ["invalid"] });
    });

    it("rejects an entries array containing another array", async () => {
      await expectInvalidLedger({ version: 2, entries: [[]] });
    });
  });

  describe("Ledger entry validation", () => {
    const validEntry = () => createEntry("/journals/example", "2026-11-04");

    const requiredFields = [
      "id",
      "kind",
      "slug",
      "dateCreated",
      "label",
      "sitemap",
      "breadcrumbs",
      "title",
      "intro",
      "photos",
      "topics",
    ] as const satisfies readonly (keyof JournalLedgerEntryAppInit)[];

    it.each(requiredFields)(
      "rejects an entry missing required field %s",
      async (field) => {
        const entry: Record<string, unknown> = { ...validEntry() };

        delete entry[field];

        await expectInvalidLedger({ version: 2, entries: [entry] });
      },
    );

    it.each([
      ["id", 123],
      ["kind", "photo"],
      ["slug", 123],
      ["dateCreated", false],
      ["label", null],
      ["sitemap", "true"],
      ["breadcrumbs", "invalid"],
      ["title", 123],
      ["intro", null],
      ["photos", {}],
      ["topics", false],
    ] as const)(
      "rejects invalid primitive type for %s",
      async (field, value) => {
        await expectInvalidLedger({
          version: 2,
          entries: [{ ...validEntry(), [field]: value }],
        });
      },
    );

    it.each(["id", "slug", "dateCreated"] as const)(
      "rejects an empty %s",
      async (field) => {
        await expectInvalidLedger({
          version: 2,
          entries: [{ ...validEntry(), [field]: "" }],
        });
      },
    );

    it.each([
      ["breadcrumbs", ["/journals", 42]],
      ["photos", [{ id: "photo-1", width: 6000, height: 4000 }, null]],
      ["topics", ["raptors", false]],
    ] as const)("rejects invalid elements in %s", async (field, value) => {
      await expectInvalidLedger({
        version: 2,
        entries: [{ ...validEntry(), [field]: value }],
      });
    });

    it("accepts valid populated ledger fields", async () => {
      const entry: JournalLedgerEntryAppInit = {
        ...validEntry(),
        breadcrumbs: ["/", "/journals"],
        photos: [
          { id: "photo-1", width: 6000, height: 4000 },
          { id: "photo-2", width: 4000, height: 6000 },
        ],
        topics: ["raptors"],
      };

      kvGet.mockResolvedValue(createLedger([entry]));

      const result = await resolve();

      expect(result.newestFirst).toEqual([entry]);
      expect(result.bySlug[entry.slug]).toBe(entry);
    });

    it("accepts empty array fields", async () => {
      const entry = validEntry();

      kvGet.mockResolvedValue(createLedger([entry]));

      const result = await resolve();

      expect(result.newestFirst).toEqual([entry]);
    });

    describe("v2 photograph validation", () => {
      const validPhoto = {
        id: "photo-1",
        width: 6000,
        height: 4000,
      };

      it("rejects legacy string photograph IDs", async () => {
        await expectInvalidLedger({
          version: 2,
          entries: [{ ...validEntry(), photos: ["photo-1"] }],
        });
      });

      it.each([
        null,
        "photo-1",
        {},
        { ...validPhoto, id: "" },
        { ...validPhoto, id: 123 },
        { ...validPhoto, width: 0 },
        { ...validPhoto, width: -1 },
        { ...validPhoto, width: NaN },
        { ...validPhoto, width: Infinity },
        { ...validPhoto, height: 0 },
        { ...validPhoto, height: -1 },
        { ...validPhoto, height: NaN },
        { ...validPhoto, height: Infinity },
        { id: "photo-1", height: 4000 },
        { id: "photo-1", width: 6000 },
      ])("rejects malformed photograph metadata: %p", async (photo) => {
        await expectInvalidLedger({
          version: 2,
          entries: [{ ...validEntry(), photos: [photo] }],
        });
      });

      it("preserves valid photograph metadata", async () => {
        const entry: JournalLedgerEntryAppInit = {
          ...validEntry(),
          photos: [validPhoto],
        };

        kvGet.mockResolvedValue(createLedger([entry]));

        const result = await resolve();

        expect(result.newestFirst[0]?.photos).toEqual([validPhoto]);
        expect(result.bySlug[entry.slug]?.photos).toBe(entry.photos);
      });
    });

    it("rejects the entire ledger if one entry is malformed", async () => {
      const valid = validEntry();
      const invalid = {
        ...createEntry("/journals/invalid", "2026-11-03"),
        photos: [null],
      };

      await expectInvalidLedger({ version: 2, entries: [valid, invalid] });
    });

    it("rejects malformed dates before sorting", async () => {
      await expectInvalidLedger({
        version: 2,
        entries: [
          { ...validEntry(), dateCreated: null },
          createEntry("/journals/second", "2026-01-01"),
        ],
      });
    });
  });

  describe("Registry construction", () => {
    it("returns an empty registry for an empty ledger", async () => {
      kvGet.mockResolvedValue(createLedger([]));

      const result = await resolve();

      expect(result).toEqual({ bySlug: {}, newestFirst: [] });
    });

    it("sorts entries by date descending", async () => {
      const oldest = createEntry("/journals/oldest", "2026-01-01");
      const newest = createEntry("/journals/newest", "2026-11-04");
      const middle = createEntry("/journals/middle", "2026-06-15");

      kvGet.mockResolvedValue(createLedger([oldest, newest, middle]));

      const result = await resolve();

      expect(result.newestFirst).toEqual([newest, middle, oldest]);
    });

    it("sorts matching dates alphabetically by slug", async () => {
      const zebra = createEntry("/journals/zebra", "2026-11-04");
      const alpha = createEntry("/journals/alpha", "2026-11-04");
      const middle = createEntry("/journals/middle", "2026-11-04");

      kvGet.mockResolvedValue(createLedger([zebra, middle, alpha]));

      const result = await resolve();

      expect(result.newestFirst).toEqual([alpha, middle, zebra]);
    });

    it("indexes published entries by slug", async () => {
      const first = createEntry("/journals/first", "2026-11-04");
      const second = createEntry("/journals/second", "2026-11-03");

      kvGet.mockResolvedValue(createLedger([first, second]));

      const result = await resolve();

      expect(result.bySlug).toEqual({
        "/journals/first": first,
        "/journals/second": second,
      });
    });

    it("rejects duplicate published slugs", async () => {
      const first = createEntry("/journals/duplicate", "2026-11-04");
      const second = createEntry("/journals/duplicate", "2026-11-03");

      kvGet.mockResolvedValue(createLedger([first, second]));

      await expect(resolve()).rejects.toThrow(
        "Duplicate published slug: /journals/duplicate",
      );
    });

    it("does not mutate the original ledger entries", async () => {
      const oldest = createEntry("/journals/oldest", "2026-01-01");
      const newest = createEntry("/journals/newest", "2026-11-04");

      const entries = Object.freeze([oldest, newest]);

      kvGet.mockResolvedValue(createLedger(entries));

      const result = await resolve();

      expect(entries).toEqual([oldest, newest]);
      expect(result.newestFirst).toEqual([newest, oldest]);
      expect(result.newestFirst).not.toBe(entries);
    });

    it("preserves entry object references", async () => {
      const entry = createEntry("/journals/example", "2026-11-04");

      kvGet.mockResolvedValue(createLedger([entry]));

      const result = await resolve();

      expect(result.newestFirst[0]).toBe(entry);
      expect(result.bySlug[entry.slug]).toBe(entry);
    });
  });
});
