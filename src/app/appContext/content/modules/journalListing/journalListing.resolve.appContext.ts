// src/app/appContext/content/modules/journalListing/journalListing.resolve.appContext.ts

import type { JournalListingModuleAuthored } from "@shared-types/content/modules/journalListing/journalListing.module.types";
import type { AppContextJournalListingModule } from "@app/appContext/content/modules/journalListing/journalListing.module.appContext.types";

import type { AppContextModuleResolverDependencies } from "@app/appContext/content/modules/module.registry.appContext";

import { getPublishedDate } from "@app/appContext/helpers/publishedDate.extract.helper.appContext";
import { sortContentByPublished } from "@app/appContext/helpers/publishedDate.sort.helper.appContext";
import { getHeroPhotoId } from "@app/appContext/helpers/heroPhoto.extract.helper.appContext";

export const resolveJournalListingModule = (
  module: JournalListingModuleAuthored,
  dependencies: AppContextModuleResolverDependencies,
): AppContextJournalListingModule => {
  const { appState } = dependencies;
  const pageSize = module.pagination.pageSize;

  const entries = [...appState.getJournalEntries()]
    .sort((a, b) => {
      return sortContentByPublished(getPublishedDate(a), getPublishedDate(b));
    })
    .slice(0, pageSize)
    .map((page) => {
      const photoId = getHeroPhotoId(page);
      const photo = dependencies.getPhotoRecordById(photoId);

      return {
        page,
        photo,
      };
    });

  return {
    kind: "journalListing",
    pagination: module.pagination,
    entries,
  };
};
