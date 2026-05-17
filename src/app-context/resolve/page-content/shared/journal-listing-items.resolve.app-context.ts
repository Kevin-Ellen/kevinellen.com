// src/app-context/resolve/page-content/shared/journal-listing-items.resolve.app-context.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppContextImageDeliveryProfile } from "@shared-types/config/image-delivery/app-context.image-delivery.types";
import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";
import type { AppContextJournalListingItem } from "@shared-types/page-content/block/journal-listing/app-context.journal-listing.block.types";
import type { AppContextResolvedPhoto } from "@shared-types/media/render-image/app-context.render-image.types";

import { appContextResolvePhotoReference } from "@app-context/resolve/page-content/shared/photo-reference.resolve.app-context";

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

const appContextResolveJournalListingImage = (
  page: AppStatePageDefinition,
  context: AppContextPageContentResolverContext,
  imageDelivery: AppContextImageDeliveryProfile,
): AppContextResolvedPhoto | null => {
  const photoId = appContextResolveJournalListingPhotoId(page);

  if (photoId === null) {
    return null;
  }

  const photo = context.resolvePhoto(photoId);

  if (photo === null) {
    throw new Error(
      `No AppContext photo resolved for journal listing photoId: ${photoId}`,
    );
  }

  return appContextResolvePhotoReference({
    reference: { id: photo.id },
    photo,
    delivery: imageDelivery,
  });
};

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

const appContextResolveJournalListingItem = (
  page: AppStatePageDefinition & {
    kind: "journal";
    slug: `/${string}` | "/";
  },
  context: AppContextPageContentResolverContext,
  imageDelivery: AppContextImageDeliveryProfile,
): AppContextJournalListingItem => ({
  id: page.id,
  href: page.slug,
  title: page.content.head.title,
  intro: page.content.head.intro,
  eyebrow: page.content.head.eyebrow,
  publishedAt: appContextResolveJournalPublishedAt(page),
  image: appContextResolveJournalListingImage(page, context, imageDelivery),
});

export const appContextResolveJournalListingItems = (
  context: AppContextPageContentResolverContext,
  imageDelivery: AppContextImageDeliveryProfile,
): readonly AppContextJournalListingItem[] =>
  context.publicPages
    .filter(appContextIsPublicJournalPage)
    .sort(appContextCompareJournalPagesByNewestFirst)
    .map((page) =>
      appContextResolveJournalListingItem(page, context, imageDelivery),
    );
