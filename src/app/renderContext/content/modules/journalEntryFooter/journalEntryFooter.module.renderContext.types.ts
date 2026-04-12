// src/app/renderContext/content/modules/journalEntryFooter/journalEntryFooter.module.renderContext.types.ts

export type RenderContextJournalEntryFooterPublicationItem =
  | {
      kind: "date";
      label: string;
      value: string; // ISO string
    }
  | {
      kind: "text";
      label: string;
      value: string;
    };

export type RenderContextJournalEntryFooterFieldNotesItem = {
  label: string;
  values: readonly string[];
};

export type RenderContextJournalEntryFooterModule = {
  kind: "journalEntryFooter";
  publication: readonly RenderContextJournalEntryFooterPublicationItem[];
  fieldNotes: readonly RenderContextJournalEntryFooterFieldNotesItem[];
};
