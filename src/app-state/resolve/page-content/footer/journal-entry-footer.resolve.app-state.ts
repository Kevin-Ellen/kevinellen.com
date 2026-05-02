// src/app-state/resolve/page-content/footer/journal-entry-footer.resolve.app-state.ts

import type { AuthoredJournalEntryFooterModule } from "@shared-types/page-content/footer/journal-entry-footer/authored.journal-entry-footer.page-content.types";
import type { AppStateJournalEntryFooterModule } from "@shared-types/page-content/footer/journal-entry-footer/app-state.journal-entry-footer.page-content.types";

export const appStateResolveJournalEntryFooterModule = (
  module: AuthoredJournalEntryFooterModule,
): AppStateJournalEntryFooterModule => module;
