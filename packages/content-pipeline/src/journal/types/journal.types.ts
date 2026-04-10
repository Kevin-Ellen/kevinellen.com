// packages/content-pipeline/src/journal/types/journal.types.ts

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
  photoSlugs: string[];
  config?: Partial<JournalEntryPageDefinition["config"]>;
};
