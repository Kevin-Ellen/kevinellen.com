// src/app/appContext/content/modules/journalEntryFooter/journalEntryFooter.module.appContext.types.ts

export type AppContextJournalEntryFooterPublicationItem = {
  label: string;
  value: string;
};

export type AppContextJournalEntryFooterFieldNotesItem = {
  label: string;
  values: readonly string[];
};

export type AppContextJournalEntryFooterModule = {
  kind: "journalEntryFooter";
  publication: readonly AppContextJournalEntryFooterPublicationItem[];
  fieldNotes: readonly AppContextJournalEntryFooterFieldNotesItem[];
};
