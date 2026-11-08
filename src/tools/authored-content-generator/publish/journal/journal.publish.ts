// src/tools/authored-content-generator/publish/journal/journal.publish.ts

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import type { ContentAuthored } from "../../../../content-schema/content/content.content-schema.authored.type";
import type { ContentAppInit } from "../../../../shared/types/content/content.shared.app-init.type";

type JournalPublisher = Readonly<{
  getAuthored: (id: string) => Promise<ContentAuthored | null>;
  putAuthored: (journal: ContentAuthored) => Promise<void>;
  getAppInit: (id: string) => Promise<ContentAppInit | null>;
  putAppInit: (journal: ContentAppInit) => Promise<void>;
}>;

type Input = Readonly<{
  directory: string;
  publisher: JournalPublisher;
}>;

type JournalArtifacts = Readonly<{
  authored: ContentAuthored;
  appInit: ContentAppInit;
}>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readJournalArtifacts = async (
  directory: string,
): Promise<JournalArtifacts> => {
  const artifactsDirectory = resolve(directory, "artifacts");

  const [authoredContent, appInitContent] = await Promise.all([
    readFile(resolve(artifactsDirectory, "journal.authored.json"), "utf8"),
    readFile(resolve(artifactsDirectory, "journal.app-init.json"), "utf8"),
  ]);

  const authoredValue: unknown = JSON.parse(authoredContent);
  const appInitValue: unknown = JSON.parse(appInitContent);

  if (
    !isRecord(authoredValue) ||
    !isRecord(appInitValue) ||
    typeof authoredValue.id !== "string" ||
    authoredValue.id.length === 0 ||
    typeof appInitValue.id !== "string" ||
    appInitValue.id.length === 0
  ) {
    throw new Error("Invalid journal artifact identity");
  }

  if (authoredValue.id !== appInitValue.id) {
    throw new Error(
      `Journal artifact ID mismatch: "${authoredValue.id}" !== "${appInitValue.id}"`,
    );
  }

  if (
    authoredValue.kind !== "public" ||
    authoredValue.pageType !== "journalEntry" ||
    appInitValue.kind !== "public" ||
    appInitValue.pageType !== "journalEntry"
  ) {
    throw new Error("Expected a public journal entry");
  }

  // The generation and validation pipeline owns the complete nested
  // artifact contracts. These checks establish identity and page type
  // before either artifact is handed to the KV publisher.
  const authored = authoredValue as ContentAuthored;
  const appInit = appInitValue as ContentAppInit;

  return { authored, appInit };
};

export const publishJournal = async ({
  directory,
  publisher,
}: Input): Promise<void> => {
  const { authored, appInit } = await readJournalArtifacts(directory);

  console.log(`Publishing journal: ${authored.id}`);

  await publisher.putAuthored(authored);
  await publisher.putAppInit(appInit);

  console.log(`✓ Journal published: ${authored.id}`);
};
