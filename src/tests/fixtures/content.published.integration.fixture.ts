// src/tests/fixtures/content.published.integration.fixture.ts

import { readFileSync } from "node:fs";
import { join } from "node:path";

// import type { ValidatedEnv } from "../../app/entry.type";
import type {
  JournalLedgerAppInit,
  JournalLedgerEntryAppInit,
} from "../../shared/types/content/kv-ledger.content.shared.type";
import type { PhotoAppResolve } from "../../app/types/photo/photo.app-resolve.type";

type JournalRecord = Readonly<{
  id: string;
  kind: string;
  slug: string;
  label: string;
  breadcrumbs: readonly string[];
  topics: JournalLedgerEntryAppInit["topics"];
  dates: Readonly<{
    created: string;
  }>;
  metadata: Readonly<{
    title: string;
    description: string;
  }>;
  body: unknown;
}>;

type PhotoRecord = PhotoAppResolve &
  Readonly<{
    width: number;
    height: number;
  }>;

const readFixture = <T>(filename: string): T =>
  JSON.parse(readFileSync(join(__dirname, "data", filename), "utf8")) as T;

const createKv = (records: ReadonlyMap<string, unknown>): KVNamespace => {
  const get = jest.fn(async (key: string) => {
    if (!records.has(key)) {
      return null;
    }

    return structuredClone(records.get(key));
  });

  return new Proxy({} as KVNamespace, {
    get: (_target, property) => {
      if (property === "get") {
        return get;
      }

      throw new Error(`Unexpected KV operation: ${String(property)}`);
    },
  });
};

export const createPublishedContentFixture = () => {
  const journal = readFixture<JournalRecord>("journal.published.app-init.json");

  const photo = readFixture<PhotoRecord>("photo.published.app-init.json");

  const entry: JournalLedgerEntryAppInit = {
    id: journal.id,
    kind: "journal",
    slug: journal.slug,
    dateCreated: journal.dates.created,
    label: journal.label,
    sitemap: true,
    breadcrumbs: journal.breadcrumbs,
    title: journal.metadata.title,
    intro: journal.metadata.description,
    photos: [photo.id],
    topics: journal.topics,
  };

  const ledger: JournalLedgerAppInit = {
    version: 1,
    entries: [entry],
  };

  const contentRecords = new Map<string, unknown>([
    ["ledger:appInit:journal", ledger],
    [`journal:appInit:${entry.id}`, journal],
  ]);

  const photoRecords = new Map<string, unknown>([
    [
      `photo:${photo.id}`,
      {
        ...photo,
        dimensions: {
          width: photo.width,
          height: photo.height,
        },
      } satisfies PhotoAppResolve,
    ],
  ]);

  const contentKv = createKv(contentRecords);
  const photoKv = createKv(photoRecords);

  return {
    journal,
    photo,
    entry,
    ledger,
    contentKv,
    photoKv,
  };
};
