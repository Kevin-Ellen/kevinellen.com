// src/app-context/resolve/page/content/shared/journal-listing-items.resolve.app-context.ts

import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";
import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppContextJournalListingItem } from "@shared-types/page-content/block/journal-listing/app-context.journal-listing.block.page-content.types";

const getPublishedAt = (page: AppStatePageDefinition): string | null => {
  const journalEntryFooter = page.content.footer.find(
    (module) => module.kind === "journalEntryFooter",
  );

  return journalEntryFooter?.publication.publishedAt ?? null;
};

const getListingPhotoId = (page: AppStatePageDefinition): string | null => {
  for (const section of page.content.content) {
    if (section.kind !== "articleSection") continue;

    const hero = section.modules.find((module) => module.kind === "hero");

    if (hero?.kind === "hero") {
      return hero.photoId;
    }
  }

  return null;
};

const isJournalPage = (
  page: AppStatePageDefinition,
): page is AppStatePageDefinition & {
  kind: "journal";
  slug: `/${string}` | "/";
} => page.kind === "journal" && page.slug !== null;

const compareJournalPagesNewestFirst = (
  a: AppStatePageDefinition,
  b: AppStatePageDefinition,
): number => {
  const aPublishedAt = getPublishedAt(a);
  const bPublishedAt = getPublishedAt(b);

  if (aPublishedAt === null && bPublishedAt === null) {
    return a.id.localeCompare(b.id);
  }

  if (aPublishedAt === null) return 1;
  if (bPublishedAt === null) return -1;

  return bPublishedAt.localeCompare(aPublishedAt) || a.id.localeCompare(b.id);
};

export const resolveJournalListingItemsAppContext = (
  context: AppContextPageContentResolverContext,
): readonly AppContextJournalListingItem[] => {
  return context.publicPages
    .filter(isJournalPage)
    .sort(compareJournalPagesNewestFirst)
    .map((page) => {
      const photoId = getListingPhotoId(page);

      const image =
        photoId === null
          ? null
          : (context.photos.find((photo) => photo.id === photoId) ?? null);

      return {
        id: page.id,
        href: page.slug,
        title: page.content.header.title,
        intro: page.content.header.intro,
        eyebrow: page.content.header.eyebrow,
        publishedAt: getPublishedAt(page),
        image,
      };
    });
};
