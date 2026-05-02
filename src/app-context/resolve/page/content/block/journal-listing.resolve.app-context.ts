// src/app-context/resolve/page/content/block/journal-listing.resolve.app-context.ts

import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";
import type { AppStateJournalListingBlockContentModule } from "@shared-types/page-content/block/journal-listing/app-state.journal-listing.block.page-content.types";
import type { AppContextJournalListingBlockContentModule } from "@shared-types/page-content/block/journal-listing/app-context.journal-listing.block.page-content.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import { resolvePaginationAppContext } from "@app-context/resolve/page/content/shared/pagination.resolve.app-context";

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

export const appContextResolveJournalListingBlockContentModule = (
  module: AppStateJournalListingBlockContentModule,
  context: AppContextPageContentResolverContext,
): AppContextJournalListingBlockContentModule => {
  const currentPage = context.routingPagination?.currentPage ?? 1;

  const journalPages = context.publicPages
    .filter(isJournalPage)
    .sort(compareJournalPagesNewestFirst);

  const pagination = resolvePaginationAppContext({
    pagination: module.pagination,
    currentPage,
    totalItems: journalPages.length,
    baseHref: "/journal",
  });

  const start = (pagination.currentPage - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;

  const items = journalPages.slice(start, end).map((page) => {
    const photoId = getListingPhotoId(page);

    const image =
      photoId === null
        ? null
        : (context.photos.find((photo) => photo.id === photoId) ?? null);

    return {
      id: page.id,
      href: page.slug, // safe after slug fix
      title: page.content.header.title,
      intro: page.content.header.intro,
      eyebrow: page.content.header.eyebrow,
      publishedAt: getPublishedAt(page),
      image, // 👈 THIS WAS MISSING
    };
  });

  return {
    kind: module.kind,
    flow: module.flow,
    pagination,
    items,
  };
};
