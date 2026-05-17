// shared-types/page-content/footer/note-entry-footer/app-context.note-entry-footer.types.ts

import type { AppStateNoteEntryFooter } from "@shared-types/page-content/footer/note-entry-footer/app-state.note-entry-footer.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type DeterministicFields = Readonly<{}>;

export type AppContextNoteEntryFooter = Replace<
  AppStateNoteEntryFooter,
  DeterministicFields
>;
