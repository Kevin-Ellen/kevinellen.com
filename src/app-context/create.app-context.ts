// src/app-context/create.app-context.ts

import type { RoutingResult } from "@request/types/request.types";
import type { AppState } from "@app-state/class.app-state";
import type { AppStatePageDefinition } from "@shared-types/page-definitions/app-state.page-definition.types";

import { AppContext } from "@app-context/class.app-context";
import { resolveNavigationAppContext } from "@app-context/resolve/navigation/navigation.resolve.app-context";
import { resolveGlobalFooterAppContext } from "@app-context/resolve/page-content/global-footer.resolve.app-context";
import { resolvePageSourceAppContext } from "@app-context/resolve/page/source.page.resolve.app-context";
import { resolvePageAppContext } from "@app-context/resolve/page/page.resolve.app-context";
import { resolveAssetsAppContext } from "@app-context/resolve/assets.resolve.app-context";
import { resolveStructuredDataAppContext } from "@app-context/resolve/structured-data.resolve.app-context";
import { resolveBreadcrumbsAppContext } from "@app-context/resolve/breadcrumbs.resolve.app-context";
import { resolveInternalLinkAppContext } from "@app-context/resolve/shared/links/internal.link.shared.resolve.app-context";
import { appContextCollectPhotoIdsFromBlockContent } from "@app-context/resolve/page-content/collect-photo-ids.page-content.resolve.app-context";
import { resolvePhotosAppContext } from "@app-context/resolve/photos/photos.resolve.app-context";

const resolvePageRuntimeAppContext = (
  page: AppStatePageDefinition,
  origin: string,
) => {
  return {
    metadata: page.metadata,
    robots: page.robots,
    canonicalUrl: page.slug ? `${origin}${page.slug}` : null,
  };
};

export const appContextCreate = async (
  appState: AppState,
  routing: RoutingResult,
  env: Env,
): Promise<AppContext> => {
  const navigation = resolveNavigationAppContext(appState.navigation, appState);
  const globalFooter = resolveGlobalFooterAppContext(appState.globalFooter);

  const pageState = resolvePageSourceAppContext(appState, routing);

  const photoIds = appContextCollectPhotoIdsFromBlockContent(
    pageState.content.content,
  );

  const photos = await resolvePhotosAppContext({
    kv: env.KV_PHOTOS,
    photoIds,
  });

  const { metadata, robots, canonicalUrl } = resolvePageRuntimeAppContext(
    pageState,
    appState.siteConfig.origin,
  );

  const assets = resolveAssetsAppContext(appState.assets, pageState.assets);
  const structuredData = resolveStructuredDataAppContext(appState, pageState);
  const breadcrumbs = resolveBreadcrumbsAppContext(
    pageState.breadcrumbs,
    appState,
  );

  const page = resolvePageAppContext(pageState, routing, {
    photos,
    metadataLabels: appState.metadataLabels,
    resolveInternalLink: (link) =>
      resolveInternalLinkAppContext(link, appState),
  });

  const language = appState.siteConfig.language;
  const headAssets = appState.siteConfig.headAssets;
  const themeColour = appState.manifest.backgroundColor;
  const headerBranding = appState.siteConfig.headerBranding;
  const preload = appState.siteConfig.preload;
  const metadataLabels = appState.metadataLabels;

  return new AppContext({
    navigation,
    globalFooter,
    assets,
    structuredData,
    breadcrumbs,
    page,
    metadata,
    robots,
    canonicalUrl,
    language,
    headAssets,
    preload,
    themeColour,
    headerBranding,
    metadataLabels,
  });
};
