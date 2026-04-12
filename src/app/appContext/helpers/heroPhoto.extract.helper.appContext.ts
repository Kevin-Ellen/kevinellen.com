// src/app/appContext/helpers/heroPhoto.extract.helper.appContext.ts

import type { JournalEntryPageDefinition } from "@shared-types/content/pages/public/journal-entry/journal-entry.public.page.definition";
import type { PhotoId } from "@shared-types/content/photos.types";

export const getHeroPhotoId = (page: JournalEntryPageDefinition): PhotoId => {
  for (const section of page.content.body) {
    const heroModule = section.modules.find((module) => module.kind === "hero");

    if (heroModule) {
      return heroModule.photoId;
    }
  }

  throw new Error(
    `Missing hero module with photoId for journal entry: ${page.core.id}`,
  );
};
