// src/app-context/resolve/page-content/shared/journal-listing-items.resolve.app-context.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";
import type { AppContextJournalListingItem } from "@shared-types/page-content/block/journal-listing/app-context.journal-listing.block.types";

const appContextResolveJournalPublishedAt = (
  page: AppStatePageDefinition,
): string | null =>
  page.content.footer.find((module) => module.kind === "journalEntryFooter")
    ?.publication.publishedAt ?? null;

const appContextResolveJournalListingPhotoId = (
  page: AppStatePageDefinition,
): string | null =>
  page.content.content
    .filter((block) => block.kind === "articleSection")
    .flatMap((section) => section.modules)
    .find((block) => block.kind === "hero")?.photoId ?? null;

const appContextIsPublicJournalPage = (
  page: AppStatePageDefinition,
): page is AppStatePageDefinition & {
  kind: "journal";
  slug: `/${string}` | "/";
} => page.kind === "journal" && page.slug !== null;

const appContextCompareJournalPagesByNewestFirst = (
  a: AppStatePageDefinition,
  b: AppStatePageDefinition,
): number => {
  const aPublishedAt = appContextResolveJournalPublishedAt(a) ?? "";
  const bPublishedAt = appContextResolveJournalPublishedAt(b) ?? "";

  return bPublishedAt.localeCompare(aPublishedAt) || a.id.localeCompare(b.id);
};

export const appContextResolveJournalListingItems = (
  context: AppContextPageContentResolverContext,
): readonly AppContextJournalListingItem[] =>
  context.publicPages
    .filter(appContextIsPublicJournalPage)
    .sort(appContextCompareJournalPagesByNewestFirst)
    .map((page) => {
      const photoId = appContextResolveJournalListingPhotoId(page);

      return {
        id: page.id,
        href: page.slug,
        title: page.content.head.title,
        intro: page.content.head.intro,
        eyebrow: page.content.head.eyebrow,
        publishedAt: appContextResolveJournalPublishedAt(page),
        image: photoId === null ? null : context.resolvePhoto(photoId),
      };
    });
