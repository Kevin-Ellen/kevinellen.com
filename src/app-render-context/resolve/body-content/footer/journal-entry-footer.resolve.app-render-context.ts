// src/app-render-context/resolve/body-content/footer/journal-entry-footer.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextJournalEntryFooterModule } from "@shared-types/page-content/footer/journal-entry-footer/app-context.journal-entry-footer.page-content.types";
import type { AppRenderContextJournalEntryFooterModule } from "@shared-types/page-content/footer/journal-entry-footer/app-render-context.journal-entry-footer.page-content.types";

import { formatDate } from "@utils/date.format.util";

export const resolveJournalEntryFooterAppRenderContext = (
  _appContext: AppContext,
  module: AppContextJournalEntryFooterModule,
): AppRenderContextJournalEntryFooterModule => {
  return {
    ...module,
    publication: {
      ...module.publication,
      publishedAt: formatDate(module.publication.publishedAt),
      updatedAt: module.publication.updatedAt.map((updatedAt) =>
        formatDate(updatedAt),
      ),
    },
  };
};
