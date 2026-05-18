// src/app-context/create.app-context.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";
import type { RoutingResult } from "@request/types/request.types";
import type { AppContextPhotoMetadata } from "@shared-types/media/photo/app-context.photo.types";

import { AppContext } from "@app-context/class.app-context";

import { appContextResolveNavigation } from "@app-context/resolve/shell/navigation/navigation.resolve.app-context";
import { appContextResolveGlobalFooter } from "@app-context/resolve/shell/footer/global-footer.resolve.app-context";
import { appContextResolvePageSource } from "@app-context/resolve/source.resolve.app-context";
import { appContextResolvePage } from "@app-context/resolve/page.resolve.app-context";
import { appContextResolveAssets } from "@app-context/resolve/assets.resolve.app-context";
import { appContextResolveStructuredData } from "@app-context/resolve/structured-data/structured-data.resolve.app-context";
import { appContextResolveBreadcrumbs } from "@app-context/resolve/breadcrumbs.resolve.app-context";
import { appContextResolveInternalLink } from "@app-context/resolve/shared/links/internal.link.shared.resolve.app-context";
import { appContextCollectPhotoIds } from "@app-context/resolve/page-content/shared/collect-photo-ids.resolve.app-context";
import { appContextResolvePhotos } from "@app-context/resolve/photos/photos.resolve.app-context";
import { appContextResolveSocialPreview } from "@app-context/resolve/social-preview.app-context";

import {
  HOMEPAGE_STRIP_PHOTO_INDEX_KEY,
  type HomepageStripPhotoIndex,
} from "@shared-types/media/photo/indices.photo.types";

const SOCIAL_PREVIEW_IMAGE_WIDTH = 1200;
const SOCIAL_PREVIEW_IMAGE_HEIGHT = 630;

const appContextResolveSocialPreviewImage = (
  explicitImage: string | null,
  usedPhotoIds: readonly string[],
  photos: readonly AppContextPhotoMetadata[],
  origin: string,
): string | null => {
  if (explicitImage) {
    return explicitImage.startsWith("http")
      ? explicitImage
      : `${origin}${explicitImage}`;
  }

  const inheritedPhotoId = usedPhotoIds[0];

  if (!inheritedPhotoId) {
    return null;
  }

  const photo = photos.find((item) => item.id === inheritedPhotoId);

  if (!photo) {
    return null;
  }

  return `${origin}/media/photo/${photo.id}/${SOCIAL_PREVIEW_IMAGE_WIDTH}/${SOCIAL_PREVIEW_IMAGE_HEIGHT}`;
};

const appContextResolvePageRuntime = (
  page: AppStatePageDefinition,
  origin: string,
  siteName: string,
  socialPreviewImage: string | null,
) => ({
  metadata: page.metadata,
  socialPreview: appContextResolveSocialPreview({
    socialPreview: page.socialPreview,
    origin,
    slug: page.slug,
    siteName,
    image: socialPreviewImage,
    imageWidth: socialPreviewImage ? SOCIAL_PREVIEW_IMAGE_WIDTH : null,
    imageHeight: socialPreviewImage ? SOCIAL_PREVIEW_IMAGE_HEIGHT : null,
  }),
  robots: page.robots,
  canonicalUrl: page.slug ? `${origin}${page.slug}` : null,
});

const appContextResolveHomepageStripPhotoIds = async (
  kv: KVNamespace,
): Promise<readonly string[]> => {
  const index = await kv.get<HomepageStripPhotoIndex>(
    HOMEPAGE_STRIP_PHOTO_INDEX_KEY,
    "json",
  );

  return index?.photoIds ?? [];
};

export const appContextCreate = async (
  appState: AppState,
  routing: RoutingResult,
  env: Env,
): Promise<AppContext> => {
  const navigation = appContextResolveNavigation(appState.navigation, appState);
  const globalFooter = appContextResolveGlobalFooter(appState.globalFooter);

  const pageState = appContextResolvePageSource(appState, routing);

  const usedPhotoIds = appContextCollectPhotoIds(pageState.content.content, {
    publicPages: appState.getPublicPages,
  });

  const homepageStripPhotoIds = await appContextResolveHomepageStripPhotoIds(
    env.KV_PHOTOS,
  );

  const usedPhotoIdSet = new Set(usedPhotoIds);

  const availableHomepageStripPhotoIds = homepageStripPhotoIds.filter(
    (photoId) => !usedPhotoIdSet.has(photoId),
  );

  const photoIds = [
    ...new Set([...usedPhotoIds, ...availableHomepageStripPhotoIds]),
  ];

  const photos = await appContextResolvePhotos({
    kv: env.KV_PHOTOS,
    photoIds,
  });

  const socialPreviewImage = appContextResolveSocialPreviewImage(
    pageState.socialPreview?.image ?? null,
    usedPhotoIds,
    photos,
    appState.siteConfig.origin,
  );

  const { metadata, socialPreview, robots, canonicalUrl } =
    appContextResolvePageRuntime(
      pageState,
      appState.siteConfig.origin,
      appState.siteConfig.siteName,
      socialPreviewImage,
    );

  const assets = appContextResolveAssets(appState.assets, pageState.assets);
  const structuredData = appContextResolveStructuredData(appState, pageState);
  const breadcrumbs = appContextResolveBreadcrumbs(
    pageState.breadcrumbs,
    appState,
  );

  const pagePhotos = photos.filter((photo) => usedPhotoIdSet.has(photo.id));

  const page = appContextResolvePage(pageState, routing, {
    photos,
    pagePhotos,
    homepageStripPhotoIds: availableHomepageStripPhotoIds,
    metadataLabels: appState.metadataLabels,
    resolveInternalLink: (link) =>
      appContextResolveInternalLink(link, appState),
    resolvePhoto: (photoId) =>
      photos.find((photo) => photo.id === photoId) ?? null,
    publicPages: appState.getPublicPages,
    currentPageSlug: pageState.slug,
    routingPagination: routing.kind === "found" ? routing.pagination : null,
    imageDelivery: appState.imageDelivery,
  });

  return new AppContext({
    navigation,
    globalFooter,
    assets,
    structuredData,
    breadcrumbs,
    page,
    metadata,
    socialPreview,
    robots,
    canonicalUrl,
    language: appState.siteConfig.language,
    headAssets: appState.siteConfig.headAssets,
    preload: appState.siteConfig.preload,
    themeColour: appState.manifest.backgroundColor,
    headerBranding: appState.siteConfig.headerBranding,
    metadataLabels: appState.metadataLabels,
  });
};
