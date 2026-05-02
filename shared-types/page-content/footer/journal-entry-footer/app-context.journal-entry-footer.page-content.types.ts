// shared-types/page-content/footer/journal-entry-footer/app-context.journal-entry-footer.page-content.types.ts

import type { AppStateJournalEntryFooterModule } from "@shared-types/page-content/footer/journal-entry-footer/app-state.journal-entry-footer.page-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppContextJournalEntryFooterModuleDeterministicFields = Readonly<{
  equipment: Readonly<{
    cameras: readonly string[];
    lenses: readonly string[];
  }>;
}>;

export type AppContextJournalEntryFooterModule = Replace<
  AppStateJournalEntryFooterModule,
  AppContextJournalEntryFooterModuleDeterministicFields
>;
