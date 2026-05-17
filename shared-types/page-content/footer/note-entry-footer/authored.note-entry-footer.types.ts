// shared-types/page-content/footer/note-entry-footer/authored.note-entry-footer.types.ts

export type AuthoredNoteEntryFooter = Readonly<{
  kind: "noteEntryFooter";
  publication: Readonly<{
    author: string;
    publishedAt: string;
    updatedAt: readonly string[];
  }>;
  topic: string;
  tags: readonly string[];
}>;
