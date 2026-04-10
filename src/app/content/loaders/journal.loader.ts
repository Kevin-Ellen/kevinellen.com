// src/app/content/loaders/journal.loader.ts

import type { JournalEntryPageDefinition } from "@shared-types/content/pages/public/journal-entry/journal-entry.public.page.definition";

export const loadJournalPagesFromKV = async (
  kv: KVNamespace,
): Promise<readonly JournalEntryPageDefinition[]> => {
  const keys = await kv.list({ prefix: "journal:" });

  const entries = await Promise.all(
    keys.keys.map(async (key) => {
      const value = await kv.get(key.name);

      if (!value) return null;

      return JSON.parse(value) as JournalEntryPageDefinition;
    }),
  );

  return entries.filter(
    (entry): entry is JournalEntryPageDefinition => entry !== null,
  );
};
