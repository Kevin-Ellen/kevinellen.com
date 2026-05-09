// shared-types/page-content/footer/journal-entry-footer/app-context.journal-entry-footer.types.ts

import type { AppStateJournalEntryFooter } from "@shared-types/page-content/footer/journal-entry-footer/app-state.journal-entry-footer.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type DeterministicFields = Readonly<{
  equipment: Readonly<{
    cameras: readonly string[];
    lenses: readonly string[];
  }>;
}>;

export type AppContextJournalEntryFooter = Replace<
  AppStateJournalEntryFooter,
  DeterministicFields
>;
