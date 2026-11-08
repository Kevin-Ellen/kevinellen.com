// src/app/life-cycle/routing/ledger/ledger.routing.ts

import type { ValidatedEnv } from "../../../entry.type";

import type {
  JournalLedgerEntryAppInit,
  PublishedRegistry,
} from "../../../../shared/types/content/kv-ledger.content.shared.type";

type Input = Readonly<{
  env: ValidatedEnv;
}>;

type LedgerEntryShape = Omit<JournalLedgerEntryAppInit, "topics"> &
  Readonly<{
    topics: readonly string[];
  }>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) &&
  value.every((item: unknown) => typeof item === "string");

const isLedgerEntry = (value: unknown): value is LedgerEntryShape => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    value.id.length > 0 &&
    value.kind === "journal" &&
    typeof value.slug === "string" &&
    value.slug.length > 0 &&
    typeof value.dateCreated === "string" &&
    value.dateCreated.length > 0 &&
    typeof value.label === "string" &&
    typeof value.sitemap === "boolean" &&
    isStringArray(value.breadcrumbs) &&
    typeof value.title === "string" &&
    typeof value.intro === "string" &&
    isStringArray(value.photos) &&
    isStringArray(value.topics)
  );
};

export const resolveJournalLedgerRouting = async ({
  env,
}: Input): Promise<PublishedRegistry> => {
  const ledger = await env.CONTENT_KV.get<unknown>(
    "ledger:appInit:journal",
    "json",
  );

  if (ledger === null) {
    throw new Error("Published journal AppInit ledger not found");
  }

  if (
    !isRecord(ledger) ||
    ledger.version !== 1 ||
    !Array.isArray(ledger.entries) ||
    !ledger.entries.every(isLedgerEntry)
  ) {
    throw new Error("Invalid published journal AppInit ledger");
  }

  // TopicId membership is guaranteed by the publishing validation contract.
  // The runtime guard establishes the structural shape of KV entries.
  const entries = ledger.entries as JournalLedgerEntryAppInit[];

  const newestFirst = [...entries].sort(
    (a, b) =>
      b.dateCreated.localeCompare(a.dateCreated) ||
      a.slug.localeCompare(b.slug),
  );

  const bySlug: Record<string, JournalLedgerEntryAppInit> = {};

  for (const entry of newestFirst) {
    if (Object.hasOwn(bySlug, entry.slug)) {
      throw new Error(`Duplicate published slug: ${entry.slug}`);
    }

    bySlug[entry.slug] = entry;
  }

  return {
    bySlug,
    newestFirst,
  };
};
