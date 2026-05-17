// src/app-context/resolve/page-content/footer/note-entry-footer/note-entry-footer.resolve.app-context.ts

import type { AppStateNoteEntryFooter } from "@shared-types/page-content/footer/note-entry-footer/app-state.note-entry-footer.types";
import type { AppContextNoteEntryFooter } from "@shared-types/page-content/footer/note-entry-footer/app-context.note-entry-footer.types";

export const appContextResolveNoteEntryFooter = (
  module: AppStateNoteEntryFooter,
): AppContextNoteEntryFooter => module;
