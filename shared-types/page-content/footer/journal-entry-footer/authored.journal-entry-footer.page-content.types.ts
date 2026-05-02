// shared-types/page-content/footer/journal-entry-footer/authored.journal-entry-footer.page-content.types.ts

export type AuthoredJournalEntryFooterModule = Readonly<{
  kind: "journalEntryFooter";
  publication: Readonly<{
    author: string;
    publishedAt: string;
    updatedAt: readonly string[];
  }>;
  tags: readonly string[];
}>;
