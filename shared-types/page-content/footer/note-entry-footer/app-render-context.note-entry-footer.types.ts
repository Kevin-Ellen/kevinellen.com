// shared-types/page-content/footer/note-entry-footer/app-render-context.note-entry-footer.types.ts

import type { AppContextNoteEntryFooter } from "@shared-types/page-content/footer/note-entry-footer/app-context.note-entry-footer.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppRenderContextNoteEntryFooterPublication = Replace<
  AppContextNoteEntryFooter["publication"],
  {
    publishedAt: string;
    updatedAt: string;
  }
>;

export type AppRenderContextNoteEntryFooter = Replace<
  AppContextNoteEntryFooter,
  {
    publication: AppRenderContextNoteEntryFooterPublication;
  }
>;
