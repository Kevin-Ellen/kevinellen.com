// src/shared/resolvers/content/modules/journal-listing/journal-listing.module.content.resolver.shared.app-init.ts

import type { JournalListingModuleContentAuthored } from "../../../../../content-schema/content/modules/journal-listing.module.content.content-schema.type";
import type { JournalListingModuleAppInit } from "../../../../types/content/modules/journal-listing.module.content.shared.app-init.type";

type Input = Readonly<{
  authored: JournalListingModuleContentAuthored;
}>;

export const resolveJournalListingModuleAppInit = ({
  authored,
}: Input): JournalListingModuleAppInit => {
  if (!Number.isSafeInteger(authored.pageSize) || authored.pageSize < 1) {
    throw new Error("Journal listing pageSize must be a positive integer");
  }

  if (!Number.isSafeInteger(authored.photoLimit) || authored.photoLimit < 1) {
    throw new Error("Journal listing photoLimit must be a positive integer");
  }

  return {
    ...authored,
    eyebrow: authored.eyebrow ?? "Latest entry",
    pagination: authored.pagination ?? true,
    displayFeatured: authored.displayFeatured ?? true,
    showViewAllLink: authored.showViewAllLink ?? false,
    topicId: authored.topicId ?? null,
  };
};
