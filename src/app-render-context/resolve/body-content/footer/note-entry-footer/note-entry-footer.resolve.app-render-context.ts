// src/app-render-context/resolve/body-content/footer/note-entry-footer/note-entry-footer.resolve.app-render-context.ts

import type { AppContextNoteEntryFooter } from "@shared-types/page-content/footer/note-entry-footer/app-context.note-entry-footer.types";
import type { AppRenderContextNoteEntryFooter } from "@shared-types/page-content/footer/note-entry-footer/app-render-context.note-entry-footer.types";

import { formatDate } from "@utils/date.format.util";

export const appRenderContextResolveNoteEntryFooter = (
  footer: AppContextNoteEntryFooter,
): AppRenderContextNoteEntryFooter => {
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
