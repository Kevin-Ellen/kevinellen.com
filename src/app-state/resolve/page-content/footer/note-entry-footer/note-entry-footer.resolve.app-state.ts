// src/app-state/resolve/page-content/footer/note-entry-footer.resolve.app-state.ts

import type { AuthoredNoteEntryFooter } from "@shared-types/page-content/footer/note-entry-footer/authored.note-entry-footer.types";
import type { AppStateNoteEntryFooter } from "@shared-types/page-content/footer/note-entry-footer/app-state.note-entry-footer.types";

export const appStateResolveNoteEntryFooter = (
  footer: AuthoredNoteEntryFooter,
): AppStateNoteEntryFooter => footer;
