// src/tests/integration/journal.published.integration.test.ts

import { resolveJournalLedgerRouting } from "../../app/life-cycle/routing/ledger/ledger.routing";

import { getKvContentAppResolve } from "../../app/life-cycle/app-resolve/getters/content/kv/kv.content.getter.app-resolve";

import { createPhotoGetter } from "../../app/life-cycle/app-resolve/getters/photo-kv/photo-kv.getter.app-resolve";

import { createPublishedContentFixture } from "../fixtures/content.published.integration.fixture";

import type { ValidatedEnv } from "../../app/entry.type";
import type {
  JournalLedgerAppInit,
  JournalLedgerEntryAppInit,
} from "../../shared/types/content/kv-ledger.content.shared.type";

describe("Journal publishing integration", () => {
  const fixture = createPublishedContentFixture();

  // Only Cloudflare's KV binding is simulated.
  // Ledger and content resolvers remain real.
  const createKv = (records: ReadonlyMap<string, unknown>): KVNamespace => {
    const get = jest.fn(async (key: string) => {
      const value = records.get(key);

      return value === undefined ? null : structuredClone(value);
    });

    return { get } as unknown as KVNamespace;
  };

  const createEnv = (records: ReadonlyMap<string, unknown>): ValidatedEnv =>
    ({
      CONTENT_KV: createKv(records),
      PHOTO_KV: fixture.photoKv,
    }) as ValidatedEnv;

  const createLedger = (
    entries: readonly JournalLedgerEntryAppInit[] = [fixture.entry],
  ): JournalLedgerAppInit => ({
    version: 1,
    entries,
  });

  describe("Published journal ledger", () => {
    it("loads a valid published journal ledger", async () => {
      const ledger = createLedger();

      const env = createEnv(new Map([["ledger:appInit:journal", ledger]]));

      const result = await resolveJournalLedgerRouting({ env });

      expect(result.newestFirst).toEqual([fixture.entry]);

      expect(result.bySlug[fixture.entry.slug]).toEqual(fixture.entry);
    });

    it("rejects a missing published journal ledger", async () => {
      const env = createEnv(new Map());

      await expect(resolveJournalLedgerRouting({ env })).rejects.toThrow(
        "Published journal AppInit ledger not found",
      );
    });

    it("rejects an unsupported ledger version", async () => {
      const env = createEnv(
        new Map<string, unknown>([
          [
            "ledger:appInit:journal",
            {
              version: 2,
              entries: [fixture.entry],
            },
          ],
        ]),
      );

      await expect(resolveJournalLedgerRouting({ env })).rejects.toThrow(
        "Invalid published journal AppInit ledger",
      );
    });

    it("rejects a ledger with invalid entries", async () => {
      const env = createEnv(
        new Map<string, unknown>([
          [
            "ledger:appInit:journal",
            {
              version: 1,
              entries: {},
            },
          ],
        ]),
      );

      await expect(resolveJournalLedgerRouting({ env })).rejects.toThrow(
        "Invalid published journal AppInit ledger",
      );
    });

    it("rejects duplicate published journal slugs", async () => {
      const duplicate: JournalLedgerEntryAppInit = {
        ...fixture.entry,
        id: "duplicate-entry",
      };

      const ledger = createLedger([fixture.entry, duplicate]);

      const env = createEnv(new Map([["ledger:appInit:journal", ledger]]));

      await expect(resolveJournalLedgerRouting({ env })).rejects.toThrow(
        `Duplicate published slug: ${fixture.entry.slug}`,
      );
    });

    it("orders journal entries newest first", async () => {
      const older: JournalLedgerEntryAppInit = {
        ...fixture.entry,
        id: "older-entry",
        slug: "/journal/older-entry",
        dateCreated: "2025-01-01",
      };

      const newer: JournalLedgerEntryAppInit = {
        ...fixture.entry,
        id: "newer-entry",
        slug: "/journal/newer-entry",
        dateCreated: "2026-12-01",
      };

      const ledger = createLedger([older, fixture.entry, newer]);

      const env = createEnv(new Map([["ledger:appInit:journal", ledger]]));

      const result = await resolveJournalLedgerRouting({ env });

      expect(result.newestFirst.map(({ id }) => id)).toEqual([
        "newer-entry",
        fixture.entry.id,
        "older-entry",
      ]);
    });

    it("uses slug ordering when creation dates match", async () => {
      const first: JournalLedgerEntryAppInit = {
        ...fixture.entry,
        id: "first-entry",
        slug: "/journal/alpha",
      };

      const second: JournalLedgerEntryAppInit = {
        ...fixture.entry,
        id: "second-entry",
        slug: "/journal/zulu",
      };

      const ledger = createLedger([second, first]);

      const env = createEnv(new Map([["ledger:appInit:journal", ledger]]));

      const result = await resolveJournalLedgerRouting({ env });

      expect(result.newestFirst.map(({ slug }) => slug)).toEqual([
        "/journal/alpha",
        "/journal/zulu",
      ]);
    });

    it("does not mutate the source ledger entries", async () => {
      const entries = Object.freeze([fixture.entry]);

      const ledger = createLedger(entries);

      const env = createEnv(new Map([["ledger:appInit:journal", ledger]]));

      await resolveJournalLedgerRouting({ env });

      expect(entries).toEqual([fixture.entry]);
    });
  });

  describe("Published journal content", () => {
    it("retrieves the actual published Amager journal", async () => {
      const result = await getKvContentAppResolve({
        kv: fixture.contentKv,
        key: `journal:appInit:${fixture.entry.id}`,
        expectedId: fixture.entry.id,
        expectedSlug: fixture.entry.slug,
      });

      expect(result.kind).toBe("found");

      if (result.kind !== "found") {
        throw new Error("Expected published journal content");
      }

      expect(result.content.id).toBe(fixture.entry.id);
      expect(result.content.slug).toBe(fixture.entry.slug);

      expect(result.content.pageType).toBe("journalEntry");
      expect(result.content.status).toBe(200);
    });

    it("returns 404 when a ledger entry has no published content", async () => {
      const kv = createKv(
        new Map<string, unknown>([["ledger:appInit:journal", createLedger()]]),
      );

      const result = await getKvContentAppResolve({
        kv,
        key: `journal:appInit:${fixture.entry.id}`,
        expectedId: fixture.entry.id,
        expectedSlug: fixture.entry.slug,
      });

      expect(result).toEqual({
        kind: "not-found",
        status: 404,
      });
    });

    it("does not confuse the ledger key with a content key", async () => {
      const result = await getKvContentAppResolve({
        kv: fixture.contentKv,
        key: "journal:appInit:non-existent-entry",
        expectedId: "non-existent-entry",
        expectedSlug: "/journals/non-existent-entry",
      });

      expect(result).toEqual({
        kind: "not-found",
        status: 404,
      });
    });
  });

  describe("Photograph references", () => {
    it("retrieves a published photograph from PHOTO_KV", async () => {
      const getPhoto = createPhotoGetter(fixture.photoKv);

      const result = await getPhoto(fixture.photo.id);

      expect(result).not.toBeNull();

      expect(result?.id).toBe(fixture.photo.id);
      expect(result?.dimensions.width).toBeGreaterThan(0);
      expect(result?.dimensions.height).toBeGreaterThan(0);
    });

    it("returns null when a referenced photograph is absent", async () => {
      const getPhoto = createPhotoGetter(fixture.photoKv);

      const result = await getPhoto("missing-published-photograph");

      expect(result).toBeNull();
    });
  });
});
