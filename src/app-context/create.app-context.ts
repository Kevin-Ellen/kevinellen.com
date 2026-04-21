// src/app-context/create.app-context.ts

import type { RoutingResult } from "@request/types/request.types";
import type { AppState } from "@app-state/class.app-state";
import type { AppStatePublicPageDefinition } from "@shared-types/pages/definitions/public/app-state.public.definition.page.types";
import type { AppStateErrorPageDefinition } from "@shared-types/pages/definitions/error/app-state.base.error.definition.page.types";

import { AppContext } from "@app-context/class.app-context";
import { resolveNavigationAppContext } from "@app-context/resolve/navigation/navigation.resolve.app-context";
import { resolveGlobalFooterAppContext } from "@app-context/resolve/page-content/global-footer.resolve.app-context";
import { resolvePageSourceAppContext } from "@app-context/resolve/page/source.page.resolve.app-context";
import { resolvePageAppContext } from "@app-context/resolve/page/page.resolve.app-context";
import { resolveAssetsAppContext } from "@app-context/resolve/assets.resolve.app-context";
import { resolveStructuredDataAppContext } from "@app-context/resolve/structured-data.resolve.app-context";
import { resolveBreadcrumbsAppContext } from "@app-context/resolve/breadcrumbs.resolve.app-context";
import { resolveInternalLinkAppContext } from "@app-context/resolve/shared/links/internal.link.shared.resolve.app-context";

const resolvePageRuntimeAppContext = (
  page: AppStatePublicPageDefinition | AppStateErrorPageDefinition,
  origin: string,
) => {
  return {
    ...("metadata" in page ? { metadata: page.metadata } : {}),
    ...("robots" in page ? { robots: page.robots } : {}),
    canonicalUrl: "slug" in page ? `${origin}${page.slug}` : null,
  };
};

export const appContextCreate = (
  appState: AppState,
  routing: RoutingResult,
): AppContext => {
  const navigation = resolveNavigationAppContext(appState.navigation, appState);
  const globalFooter = resolveGlobalFooterAppContext(appState.globalFooter);

  const pageState = resolvePageSourceAppContext(appState, routing);
  const pageRuntime = resolvePageRuntimeAppContext(
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
    resolveInternalLink: (link) =>
      resolveInternalLinkAppContext(link, appState),
  });

  const language = appState.siteConfig.language; // wherever this lives

  return new AppContext({
    navigation,
    globalFooter,
    assets,
    structuredData,
    breadcrumbs,
    page,
    metadata: pageRuntime.metadata,
    robots: pageRuntime.robots,
    canonicalUrl: pageRuntime.canonicalUrl,
    language,
  });
};
