// shared-types/page-content/block/journal-entry-footer/authored.journal-entry-footer.block.page-content.types.ts

type JournalEntryFooterPublication = Readonly<{
  author: string;
  published: string;
  updatedAt: readonly string[];
}>;

export type AuthoredJournalEntryFooterBlockContentModule = Readonly<{
  kind: "journalEntryFooter";
  publication: JournalEntryFooterPublication;
  tags: readonly string[];
}>;
