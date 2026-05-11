// src/app-render-context/resolve/body-content/footer/journal-entry-footer.resolve.app-render-context.ts

import type { AppContextJournalEntryFooter } from "@shared-types/page-content/footer/journal-entry-footer/app-context.journal-entry-footer.types";
import type { AppRenderContextJournalEntryFooter } from "@shared-types/page-content/footer/journal-entry-footer/app-render-context.journal-entry-footer.types";

import { formatDate } from "@utils/date.format.util";

export const appRenderContextResolveJournalEntryFooter = (
  footer: AppContextJournalEntryFooter,
): AppRenderContextJournalEntryFooter => {
  const lastUpdated =
    footer.publication.updatedAt[footer.publication.updatedAt.length - 1] ??
    footer.publication.publishedAt;

  return {
    ...footer,
    publication: {
      ...footer.publication,
      publishedAt: formatDate(footer.publication.publishedAt),
      updatedAt: formatDate(lastUpdated),
    },
  };
};
