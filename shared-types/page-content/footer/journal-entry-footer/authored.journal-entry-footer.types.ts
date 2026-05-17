// shared-types/page-content/footer/journal-entry-footer/authored.journal-entry-footer.types.ts

export type AuthoredJournalEntryFooter = Readonly<{
  kind: "journalEntryFooter";
  publication: Readonly<{
    author: string;
    publishedAt: string;
    updatedAt: readonly string[];
  }>;
  tags: readonly string[];
}>;
