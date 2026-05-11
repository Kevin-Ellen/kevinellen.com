// shared-types/page-content/footer/app-state.page-footer.types.ts

import type { AppStateJournalEntryFooter } from "@shared-types/page-content/footer/journal-entry-footer/app-state.journal-entry-footer.types";
import type { AppStateNoteEntryFooter } from "@shared-types/page-content/footer/note-entry-footer/app-state.note-entry-footer.types";

export type AppStatePageContentFooter =
  | AppStateJournalEntryFooter
  | AppStateNoteEntryFooter;
