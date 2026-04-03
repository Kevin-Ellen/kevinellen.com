// src/app/appContext/create.appContext.ts

import type { AppState } from "@app/appState/class.appState";
import type { DocumentRenderTarget } from "@app/request/request.document.types";

import { AppContext } from "@app/appContext/class.appContext";
import { resolveBreadcrumbsAppContext } from "@app/appContext/resolvers/breadcrumbs.resolve.appContext";
import { resolveNavigationAppContext } from "@app/appContext/resolvers/navigation.resolve.appContext";
import { resolveAssetsAppContext } from "@app/appContext/resolvers/assets.resolve.appContext";
import { resolveStructuredDataAppContext } from "@app/appContext/resolvers/structured-data.resolve.appContext";

export const createAppContext = (
  req: Request,
  appState: AppState,
  target: DocumentRenderTarget,
): AppContext => {
  const breadcrumbs = resolveBreadcrumbsAppContext(
    target.page.navigation.breadcrumbs,
    appState,
  );

  const currentPageId = target.kind === "page" ? target.page.core.id : null;

  const navigation = resolveNavigationAppContext(currentPageId, appState);

  const assets = resolveAssetsAppContext(appState, target);
  const structuredData = resolveStructuredDataAppContext(appState, target);

  return new AppContext({
    request: req,
    siteConfig: appState.getSiteConfig(),
    target,
    breadcrumbs,
    navigation,
    assets,
    structuredData,
  });
};
