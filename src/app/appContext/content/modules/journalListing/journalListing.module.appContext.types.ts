// src/app/appContext/content/modules/journalListing/journalListing.module.appContext.types.ts

import type { AppContextPagination } from "@app/appContext/appContext.types";
import type { JournalEntryPageDefinition } from "@shared-types/content/pages/public/journal-entry/journal-entry.public.page.definition";
import type { AppContextPhoto } from "@app/appContext/appContext.types";

export type AppContextJournalListingEntry = {
  page: JournalEntryPageDefinition;
  photo: AppContextPhoto;
};

export type AppContextJournalListingModule = {
  kind: "journalListing";
  pagination: AppContextPagination;
  entries: readonly AppContextJournalListingEntry[];
};
