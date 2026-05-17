// shared-types/page-content/footer/journal-entry-footer/app-render-context.journal-entry-footer.types.ts

import type { AppContextJournalEntryFooter } from "@shared-types/page-content/footer/journal-entry-footer/app-context.journal-entry-footer.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppRenderContextJournalEntryFooterPublication = Replace<
  AppContextJournalEntryFooter["publication"],
  {
    publishedAt: string;
    updatedAt: string;
  }
>;

export type AppRenderContextJournalEntryFooter = Replace<
  AppContextJournalEntryFooter,
  {
    publication: AppRenderContextJournalEntryFooterPublication;
  }
>;
