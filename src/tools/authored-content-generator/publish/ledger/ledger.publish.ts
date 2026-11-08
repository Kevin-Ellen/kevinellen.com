// src/tools/authored-content-generator/publish/ledger/ledger.publish.ts

import { execFile } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { isDeepStrictEqual, promisify } from "node:util";

import type { ContentAppInit } from "../../../../shared/types/content/content.shared.app-init.type";
import type { PublicContentAuthored } from "../../../../content-schema/content/public.content.content-schema.authored.type";

import type {
  JournalLedgerAuthored,
  JournalLedgerAppInit,
  JournalLedgerEntryAuthored,
  JournalLedgerEntryAppInit,
} from "../../../../shared/types/content/kv-ledger.content.shared.type";

type PublishMode = "--local" | "--remote";

type Input = Readonly<{
  directory: string;
  mode: PublishMode;
}>;

type JournalArtifacts = Readonly<{
  authored: PublicContentAuthored;
  appInit: ContentAppInit;
}>;

type LedgerEntryIdentity = Readonly<{
  id: string;
  dateCreated: string;
}>;

type LedgerShape = Readonly<{
  version: 1;
  entries: readonly LedgerEntryIdentity[];
}>;

const execFileAsync = promisify(execFile);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isLedgerEntry = (value: unknown): value is LedgerEntryIdentity =>
  isRecord(value) &&
  typeof value.id === "string" &&
  value.id.length > 0 &&
  typeof value.dateCreated === "string" &&
  value.dateCreated.length > 0;

const isLedgerShape = (value: unknown): value is LedgerShape =>
  isRecord(value) &&
  value.version === 1 &&
  Array.isArray(value.entries) &&
  value.entries.every(isLedgerEntry);

const bindingArgs = (mode: PublishMode): string[] => [
  "--binding",
  "CONTENT_KV",
  mode,
];

const runWrangler = async (args: string[]): Promise<string> => {
  const { stdout } = await execFileAsync(
    "npx",
    ["--no-install", "wrangler", "kv", "key", ...args],
    {
      maxBuffer: 10 * 1024 * 1024,
    },
  );

  return stdout;
};

const readJournalArtifacts = async (
  directory: string,
): Promise<JournalArtifacts> => {
  const artifactsDirectory = resolve(directory, "artifacts");

  const [authoredJson, appInitJson] = await Promise.all([
    readFile(resolve(artifactsDirectory, "journal.authored.json"), "utf8"),
    readFile(resolve(artifactsDirectory, "journal.app-init.json"), "utf8"),
  ]);

  const authoredValue: unknown = JSON.parse(authoredJson);
  const appInitValue: unknown = JSON.parse(appInitJson);

  if (
    !isRecord(authoredValue) ||
    !isRecord(appInitValue) ||
    typeof authoredValue.id !== "string" ||
    authoredValue.id.length === 0 ||
    typeof appInitValue.id !== "string" ||
    appInitValue.id.length === 0 ||
    typeof authoredValue.slug !== "string" ||
    typeof appInitValue.slug !== "string" ||
    authoredValue.kind !== "public" ||
    appInitValue.kind !== "public" ||
    authoredValue.pageType !== "journalEntry" ||
    appInitValue.pageType !== "journalEntry" ||
    authoredValue.id !== appInitValue.id ||
    authoredValue.slug !== appInitValue.slug
  ) {
    throw new Error("Invalid journal content for ledger publication");
  }

  // The artifact generation and validation pipeline owns the complete
  // nested content contracts. Identity and classification are checked
  // here before the artifacts are used to update the published ledger.
  const authored = authoredValue as PublicContentAuthored;
  const appInit = appInitValue as ContentAppInit;

  return { authored, appInit };
};

const readLedger = async <T extends LedgerShape>(
  key: string,
  empty: T,
  mode: PublishMode,
): Promise<T> => {
  const keysValue: unknown = JSON.parse(
    await runWrangler(["list", ...bindingArgs(mode)]),
  );

  if (
    !Array.isArray(keysValue) ||
    !keysValue.every(
      (entry: unknown) => isRecord(entry) && typeof entry.name === "string",
    )
  ) {
    throw new Error("Invalid KV key list");
  }

  const keys: readonly { name: string }[] = keysValue;

  if (!keys.some((entry) => entry.name === key)) {
    return empty;
  }

  const json = await runWrangler(["get", key, ...bindingArgs(mode), "--text"]);

  const ledger: unknown = JSON.parse(json);

  if (!isLedgerShape(ledger)) {
    throw new Error(`Invalid journal ledger: ${key}`);
  }

  // Existing entries have been checked for the fields required by
  // updateLedger(). The complete entry shape is governed by the
  // publishing contract and preserved through this update.
  return ledger as T;
};

const updateLedger = <T extends LedgerEntryIdentity>(
  entries: readonly T[],
  entry: T,
): T[] => {
  return [
    ...entries.filter((existing) => existing.id !== entry.id),
    entry,
  ].sort(
    (a, b) =>
      b.dateCreated.localeCompare(a.dateCreated) || a.id.localeCompare(b.id),
  );
};

const writeLedger = async (
  key: string,
  filePath: string,
  mode: PublishMode,
): Promise<void> => {
  await runWrangler(["put", key, "--path", filePath, ...bindingArgs(mode)]);

  const actual: unknown = JSON.parse(
    await runWrangler(["get", key, ...bindingArgs(mode), "--text"]),
  );

  const expected: unknown = JSON.parse(await readFile(filePath, "utf8"));

  if (!isDeepStrictEqual(actual, expected)) {
    throw new Error(`Ledger verification failed: ${key}`);
  }

  console.log(`✓ Published and verified: ${key}`);
};

export const publishJournalLedger = async ({
  directory,
  mode,
}: Input): Promise<void> => {
  const { authored, appInit } = await readJournalArtifacts(directory);

  if (!authored.photos?.length) {
    throw new Error(`Journal "${authored.id}" has no photograph inventory`);
  }

  if (new Set(authored.photos).size !== authored.photos.length) {
    throw new Error(`Journal "${authored.id}" contains duplicate photographs`);
  }

  const introModule = authored.body.modules.find(
    (module) => module.kind === "pageIntro",
  );

  if (!introModule || introModule.kind !== "pageIntro") {
    throw new Error(`Missing journal introduction: ${authored.id}`);
  }

  if (!introModule.description?.trim()) {
    throw new Error(`Missing journal introduction description: ${authored.id}`);
  }

  const common = {
    id: authored.id,
    kind: "journal" as const,
    slug: authored.slug,
    dateCreated: authored.dates.created,
    label: authored.label,
    sitemap: authored.metadata.sitemap,
    breadcrumbs: authored.breadcrumbs,
    title: authored.metadata.title,
    intro: introModule.description,
    photos: authored.photos,
    topics: authored.topics ?? [],
  } satisfies JournalLedgerEntryAuthored;

  const authoredEntry: JournalLedgerEntryAuthored = common;

  const appInitEntry: JournalLedgerEntryAppInit = {
    ...common,
    sitemap: appInit.metadata.sitemap,
    breadcrumbs: appInit.breadcrumbs,
    title: appInit.metadata.title,
    topics: appInit.topics,
  };

  const authoredKey = "ledger:authored:journal";
  const appInitKey = "ledger:appInit:journal";

  const existingAuthored = await readLedger<JournalLedgerAuthored>(
    authoredKey,
    {
      version: 1,
      entries: [],
    },
    mode,
  );

  const existingAppInit = await readLedger<JournalLedgerAppInit>(
    appInitKey,
    {
      version: 1,
      entries: [],
    },
    mode,
  );

  const authoredLedger: JournalLedgerAuthored = {
    version: 1,
    entries: updateLedger(existingAuthored.entries, authoredEntry),
  };

  const appInitLedger: JournalLedgerAppInit = {
    version: 1,
    entries: updateLedger(existingAppInit.entries, appInitEntry),
  };

  const artifactsDirectory = resolve(directory, "artifacts");

  const authoredPath = resolve(artifactsDirectory, "ledger.authored.json");

  const appInitPath = resolve(artifactsDirectory, "ledger.app-init.json");

  await Promise.all([
    writeFile(
      authoredPath,
      `${JSON.stringify(authoredLedger, null, 2)}\n`,
      "utf8",
    ),
    writeFile(
      appInitPath,
      `${JSON.stringify(appInitLedger, null, 2)}\n`,
      "utf8",
    ),
  ]);

  await writeLedger(authoredKey, authoredPath, mode);
  await writeLedger(appInitKey, appInitPath, mode);

  console.log(
    `✓ ${mode === "--remote" ? "Remote" : "Local"} journal ledger publication complete`,
  );
};
