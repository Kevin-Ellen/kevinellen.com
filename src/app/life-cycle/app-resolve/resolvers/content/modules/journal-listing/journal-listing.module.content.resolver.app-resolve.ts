// src/app/life-cycle/app-resolve/resolvers/content/modules/journal-listing/journal-listing.module.content.resolver.app-resolve.ts

import type { JournalListingModuleAppInit } from "../../../../../../../shared/types/content/modules/journal-listing.module.content.shared.app-init.type";
import type { JournalListingModuleAppResolve } from "../../../../../../types/document/page/content/modules/journal-listing/journal-listing.module.content.page.document.app-resolve.type";
import type { PublishedRegistry } from "../../../../../../../shared/types/content/kv-ledger.content.shared.type";
import type { PhotoGetter } from "../../../../getters/photo-kv/photo-kv.getter.app-resolve";

import { resolvePhotoMetadataAppResolve } from "../../../primitives/photo-metadata/photo-metadata.primitive.resolver.app-resolve";
import { paginate } from "../../../../../../../shared/utilities/paginate/paginate.utility.shared";

type Input = Readonly<{
  content: JournalListingModuleAppInit;
  journalLedger: PublishedRegistry;
  getPhoto: PhotoGetter;
  requestedPage: number;
}>;

export const resolveJournalListingModuleAppResolve = async ({
  content,
  journalLedger,
  getPhoto,
  requestedPage,
}: Input): Promise<JournalListingModuleAppResolve> => {
  const { topicId } = content;

  const eligibleEntries =
    topicId === null
      ? journalLedger.newestFirst
      : journalLedger.newestFirst.filter((entry) =>
          entry.topics.includes(topicId),
        );

  const page = paginate({
    items: eligibleEntries,
    requestedPage,
    pageSize: content.pageSize,
  });

  if (!page) {
    throw new Error(`Journal listing page ${requestedPage} is out of range`);
  }

  const selectedEntries = page.items;

  const displayFeatured = content.displayFeatured && page.currentPage === 1;

  const featuredEntry = displayFeatured ? (selectedEntries[0] ?? null) : null;

  const listingEntries = featuredEntry
    ? selectedEntries.slice(1)
    : selectedEntries;

  const featured = featuredEntry
    ? {
        ...featuredEntry,
        photos: await Promise.all(
          featuredEntry.photos.slice(0, content.photoLimit).map((photoId) =>
            resolvePhotoMetadataAppResolve({
              photoId,
              getPhoto,
            }),
          ),
        ),
      }
    : null;

  const entries = await Promise.all(
    listingEntries.map(async (entry) => {
      const photoId = entry.photos[0];

      if (!photoId) {
        throw new Error(`Journal entry "${entry.slug}" has no photos`);
      }

      const photo = await resolvePhotoMetadataAppResolve({
        photoId,
        getPhoto,
      });

      return {
        ...entry,
        photos: [photo],
      };
    }),
  );

  return {
    kind: content.kind,
    topicId: content.topicId,
    heading: content.heading,
    eyebrow: content.eyebrow,
    pageSize: content.pageSize,
    showViewAllLink: content.showViewAllLink,
    displayFeatured,
    pagination: content.pagination
      ? {
          currentPage: page.currentPage,
          totalPages: page.totalPages,
          totalItems: page.totalItems,
          pageSize: page.pageSize,
        }
      : null,
    featured,
    entries,
  };
};
