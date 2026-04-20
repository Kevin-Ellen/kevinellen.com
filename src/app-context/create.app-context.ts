// src/app-context/create.app-context.ts

import type { RoutingResult } from "@request/types/request.types";
import type { AppState } from "@app-state/class.app-state";

import { AppContext } from "@app-context/class.app-context";
import { resolveNavigationAppContext } from "@app-context/resolve/navigation/navigation.resolve.app-context";
import { resolveGlobalFooterAppContext } from "@app-context/resolve/page-content/global-footer.resolve.app-context";

import { resolvePageAppContext } from "@app-context/resolve/page/page.resolve.app-context";

import { resolveAssetsAppContext } from "@app-context/resolve/assets.resolve.app-context";
import { resolveStructuredDataAppContext } from "./resolve/structured-data.resolve.app-context";
import { resolveBreadcrumbsAppContext } from "./resolve/breadcrumbs.resolve.app-context";

export const appContextCreate = (
  appState: AppState,
  routing: RoutingResult,
): AppContext => {
  const navigation = resolveNavigationAppContext(appState.navigation, appState);
  const globalFooter = resolveGlobalFooterAppContext(appState.globalFooter);

  const page = resolvePageAppContext(appState, routing);

  const assets = resolveAssetsAppContext(appState.assets, page.assets);

  const structuredData = resolveStructuredDataAppContext(appState, page);

  const breadcrumbs = resolveBreadcrumbsAppContext(page.breadcrumbs, appState);

  return new AppContext({
    navigation,
    globalFooter,
    assets,
    structuredData,
    breadcrumbs,
  });
};
