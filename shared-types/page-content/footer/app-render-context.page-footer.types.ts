// shared-types/page-content/footer/app-render-context.page-footer.types.ts

import type { AppRenderContextJournalEntryFooter } from "@shared-types/page-content/footer/journal-entry-footer/app-render-context.journal-entry-footer.types";
import type { AppRenderContextNoteEntryFooter } from "@shared-types/page-content/footer/note-entry-footer/app-render-context.note-entry-footer.types";

export type AppRenderContextPageContentFooter =
  | AppRenderContextJournalEntryFooter
  | AppRenderContextNoteEntryFooter;
