// src/app-state/resolve/page-content/footer/journal-entry-footer.resolve.app-state.ts

import type { AuthoredJournalEntryFooter } from "@shared-types/page-content/footer/journal-entry-footer/authored.journal-entry-footer.types";
import type { AppStateJournalEntryFooter } from "@shared-types/page-content/footer/journal-entry-footer/app-state.journal-entry-footer.types";

export const appStateResolveJournalEntryFooter = (
  module: AuthoredJournalEntryFooter,
): AppStateJournalEntryFooter => module;
