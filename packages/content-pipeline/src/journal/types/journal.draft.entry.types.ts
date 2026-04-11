// packages/content-pipeline/src/cli/journal/types/journal.draft.entry.types.ts

import type { JournalEntryPageDefinition } from "@shared-types/content/pages/public/journal-entry/journal-entry.public.page.definition";

export type JournalDraft = {
  id: string;
  meta: {
    pageTitle: string;
    metaDescription: string;
  };
  content: {
    head: {
      eyebrow: string;
      title: string;
      intro: string;
    };
    body: JournalEntryPageDefinition["content"]["body"];
    footer: {
      tags: string[];
    };
  };
  photoIds: string[];
  config?: Partial<JournalEntryPageDefinition["config"]>;
};
