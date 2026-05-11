// src/app-context/resolve/page-content/shared/note-listing-items.resolve.app-context.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";
import type { AppContextNoteListingItem } from "@shared-types/page-content/block/note-listing/app-context.note-listing.block.types";

const appContextResolveNoteFooter = (page: AppStatePageDefinition) =>
  page.content.footer.find((module) => module.kind === "noteEntryFooter");

const appContextResolveNotePublishedAt = (
  page: AppStatePageDefinition,
): string | null =>
  appContextResolveNoteFooter(page)?.publication.publishedAt ?? null;

const appContextResolveNoteTopic = (
  page: AppStatePageDefinition,
): string | null => appContextResolveNoteFooter(page)?.topic ?? null;

const appContextIsPublicNotePage = (
  page: AppStatePageDefinition,
): page is AppStatePageDefinition & {
  kind: "note";
  slug: `/${string}` | "/";
} => page.kind === "note" && page.slug !== null;

const appContextCompareNotePagesByNewestFirst = (
  a: AppStatePageDefinition,
  b: AppStatePageDefinition,
): number => {
  const aPublishedAt = appContextResolveNotePublishedAt(a) ?? "";
  const bPublishedAt = appContextResolveNotePublishedAt(b) ?? "";

  return bPublishedAt.localeCompare(aPublishedAt) || a.id.localeCompare(b.id);
};

export const appContextResolveNoteListingItems = (
  context: AppContextPageContentResolverContext,
): readonly AppContextNoteListingItem[] =>
  context.publicPages
    .filter(appContextIsPublicNotePage)
    .sort(appContextCompareNotePagesByNewestFirst)
    .map((page) => ({
      id: page.id,
      href: page.slug,
      title: page.content.head.title,
      intro: page.content.head.intro,
      eyebrow: page.content.head.eyebrow,
      publishedAt: appContextResolveNotePublishedAt(page),
      topic: appContextResolveNoteTopic(page),
    }));
