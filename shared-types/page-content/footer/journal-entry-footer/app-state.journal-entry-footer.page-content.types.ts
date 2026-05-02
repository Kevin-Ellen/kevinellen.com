// shared-types/page-content/footer/journal-entry-footer/app-state.journal-entry-footer.page-content.types.ts

import type { AuthoredJournalEntryFooterModule } from "@shared-types/page-content/footer/journal-entry-footer/authored.journal-entry-footer.page-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppStateJournalEntryFooterModuleDeterministicFields = Readonly<{}>;

export type AppStateJournalEntryFooterModule = Replace<
  AuthoredJournalEntryFooterModule,
  AppStateJournalEntryFooterModuleDeterministicFields
>;
