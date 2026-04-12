// src/app/appContext/helpers/publishedDate.extract.helper.appContext.ts

import type { JournalEntryPageDefinition } from "@shared-types/content/pages/public/journal-entry/journal-entry.public.page.definition";

type PagesWithPublishedDate = JournalEntryPageDefinition;

const PUBLISHED_LABEL = "Published";

export const getPublishedDate = (page: PagesWithPublishedDate): string => {
  const value = page.content.footer.publication.find(
    (item) => item.label === PUBLISHED_LABEL,
  )?.value;

  if (!value) {
    throw new Error(`Missing Published date for ${page.core.id}`);
  }

  return value;
};
