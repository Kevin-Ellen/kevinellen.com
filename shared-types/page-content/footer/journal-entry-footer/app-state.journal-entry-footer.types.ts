// shared-types/page-content/footer/journal-entry-footer/app-state.journal-entry-footer.types.ts

import type { AuthoredJournalEntryFooter } from "@shared-types/page-content/footer/journal-entry-footer/authored.journal-entry-footer.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type DeterministicFields = Readonly<{}>;

export type AppStateJournalEntryFooter = Replace<
  AuthoredJournalEntryFooter,
  DeterministicFields
>;
