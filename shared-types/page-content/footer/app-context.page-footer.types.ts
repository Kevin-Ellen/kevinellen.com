// shared-types/page-content/footer/app-context.page-footer.types.ts

import type { AppContextJournalEntryFooter } from "@shared-types/page-content/footer/journal-entry-footer/app-context.journal-entry-footer.types";
import type { AppContextNoteEntryFooter } from "@shared-types/page-content/footer/note-entry-footer/app-context.note-entry-footer.types";

export type AppContextPageContentFooter =
  | AppContextJournalEntryFooter
  | AppContextNoteEntryFooter;
