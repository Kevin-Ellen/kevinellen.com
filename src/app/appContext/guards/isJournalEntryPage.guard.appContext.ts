// src/app/appContext/guards/isJournalEntryPage.guard.appContext.ts

import type { PublicPage } from "@shared-types/content/pages/public/public.page.union";
import type { JournalEntryPageDefinition } from "@shared-types/content/pages/public/journal-entry/journal-entry.public.page.definition";

export const isJournalEntryPage = (
  page: PublicPage,
): page is JournalEntryPageDefinition => {
  return page.core.kind === "journal-entry";
};
