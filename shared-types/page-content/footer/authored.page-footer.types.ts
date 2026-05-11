// shared-types/page-content/footer/authored.page-footer.types.ts

import type { AuthoredJournalEntryFooter } from "./journal-entry-footer/authored.journal-entry-footer.types";
import type { AuthoredNoteEntryFooter } from "./note-entry-footer/authored.note-entry-footer.types";

export type AuthoredPageContentFooter =
  | AuthoredJournalEntryFooter
  | AuthoredNoteEntryFooter;
