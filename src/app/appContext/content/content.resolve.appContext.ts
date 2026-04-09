// src/app/appContext/content/content.resolve.appContext.ts

import type { AppContextPageBodyContent } from "@app/appContext/content/content.appContext.types";
import type { AppState } from "@app/appState/class.appState";
import type { ErrorPage } from "@shared-types/content/pages/error/error.page.union";
import type { PublicPage } from "@shared-types/content/pages/public/public.page.union";
import type {
  AppContextPhoto,
  AppContextPhotoId,
} from "@app/appContext/appContext.types";

import { resolveContentModuleAppContext } from "@app/appContext/content/modules/module.resolve.appContext";
import { resolveJournalEntryFooterAppContext } from "@app/appContext/content/modules/journalEntryFooter/journalEntryFooter.resolve.appContext";

import { isPublicPage } from "@app/appContext/guards/isPublicPage.guard.appContext";
import { isJournalEntryPage } from "@app/appContext/guards/isJournalEntryPage.guard.appContext";

export const resolveContentAppContext = (
  page: PublicPage | ErrorPage,
  appState: AppState,
  getPhotoRecordById: (id: AppContextPhotoId) => AppContextPhoto,
  photos: readonly AppContextPhoto[],
): AppContextPageBodyContent => {
  return {
    head: {
      eyebrow: page.content.head.eyebrow,
      title: page.content.head.title,
      intro: page.content.head.intro,
    },

    sections: page.content.body.map((section) => ({
      kind: section.kind,
      heading: section.heading
        ? {
            text: section.heading.text,
            visuallyHidden: section.heading.visuallyHidden,
            level: section.heading.level,
          }
        : undefined,
      modules: section.modules.map((module) =>
        resolveContentModuleAppContext(module, {
          appState,
          getPhotoRecordById,
        }),
      ),
    })),

    footer:
      isPublicPage(page) && isJournalEntryPage(page)
        ? resolveJournalEntryFooterAppContext(page.content.footer, photos)
        : undefined,
  };
};
