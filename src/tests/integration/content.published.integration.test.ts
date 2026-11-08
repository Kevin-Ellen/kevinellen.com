// src/tests/integration/content.published.integration.test.ts

import { resolveJournalLedgerRouting } from "../../app/life-cycle/routing/ledger/ledger.routing";

import { getKvContentAppResolve } from "../../app/life-cycle/app-resolve/getters/content/kv/kv.content.getter.app-resolve";

import { createPhotoGetter } from "../../app/life-cycle/app-resolve/getters/photo-kv/photo-kv.getter.app-resolve";

import type { ValidatedEnv } from "../../app/entry.type";

import { createPublishedContentFixture } from "../fixtures/content.published.integration.fixture";

describe("Published content integration", () => {
  const fixture = createPublishedContentFixture();

  it("resolves the published journal ledger", async () => {
    const env = {
      CONTENT_KV: fixture.contentKv,
      PHOTO_KV: fixture.photoKv,
    } as ValidatedEnv;

    const result = await resolveJournalLedgerRouting({ env });

    expect(result.newestFirst).toHaveLength(1);

    expect(result.bySlug[fixture.entry.slug]).toEqual(fixture.entry);
  });

  it("retrieves the published journal by its actual KV key", async () => {
    const result = await getKvContentAppResolve({
      kv: fixture.contentKv,
      key: `journal:appInit:${fixture.entry.id}`,
      expectedId: fixture.entry.id,
      expectedSlug: fixture.entry.slug,
    });

    expect(result.kind).toBe("found");

    if (result.kind === "found") {
      expect(result.content.id).toBe(fixture.journal.id);
      expect(result.content.slug).toBe(fixture.journal.slug);
    }
  });

  it("returns not-found for an absent journal", async () => {
    const kv = {
      get: jest.fn().mockResolvedValue(null),
    } as unknown as KVNamespace;

    const result = await getKvContentAppResolve({
      kv,
      key: "journal:appInit:missing",
      expectedId: "missing",
      expectedSlug: "/journal/missing",
    });

    expect(kv.get).toHaveBeenCalledWith("journal:appInit:missing", "json");

    expect(result).toEqual({
      kind: "not-found",
      status: 404,
    });
  });

  it("resolves the published photograph", async () => {
    const getPhoto = createPhotoGetter(fixture.photoKv);

    const photo = await getPhoto(fixture.photo.id);

    expect(photo).not.toBeNull();
    expect(photo?.id).toBe(fixture.photo.id);

    expect(photo?.dimensions).toEqual({
      width: fixture.photo.width,
      height: fixture.photo.height,
    });
  });

  it("returns null for a missing photograph", async () => {
    const getPhoto = createPhotoGetter(fixture.photoKv);

    expect(await getPhoto("missing-photo")).toBeNull();
  });

  it("rejects unsupported KV operations", () => {
    expect(() => fixture.contentKv.put).toThrow("Unexpected KV operation: put");

    expect(() => fixture.photoKv.delete).toThrow(
      "Unexpected KV operation: delete",
    );
  });
});
