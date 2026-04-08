// src/app/appContext/create.appContext.ts

import type { AppState } from "@app/appState/class.appState";
import type { DocumentRenderTarget } from "@app/request/request.document.types";

import { AppContext } from "@app/appContext/class.appContext";
import { isPublicPage } from "@app/appContext/guards/isPublicPage.guard.appContext";
import { resolveBrandingAppContext } from "@app/appContext/resolvers/branding.resolve.appContext";
import { resolveBreadcrumbsAppContext } from "@app/appContext/resolvers/breadcrumbs.resolve.appContext";
import { resolveMetadataAppContext } from "@app/appContext/resolvers/metadata.resolve.appContext";
import { resolveNavigationAppContext } from "@app/appContext/resolvers/navigation.resolve.appContext";
import { resolvePageAppContext } from "@app/appContext/resolvers/page.resolve.appContext";
import { resolveSiteIdentityAppContext } from "@app/appContext/resolvers/siteIdentify.resolve.appContext";
import { resolveAssetsAppContext } from "@app/appContext/resolvers/asset.resolve.appContext";
import { resolveIconsAppContext } from "@app/appContext/resolvers/icons.resolve.appContext";
import { resolvePageFooterAppContext } from "@app/appContext/resolvers/pageFooter.resolve.appContext";
import { resolveStructuredDataAppContext } from "@app/appContext/resolvers/structured-data.resolve.appContext";
import { resolveContentAppContext } from "@app/appContext/resolvers/content.resolve.appContext";

import { deepFreeze } from "@utils/deepFreeze.util";

export const createAppContext = (
  req: Request,
  env: Env,
  appState: AppState,
  target: DocumentRenderTarget,
): AppContext => {
  const url = new URL(req.url);
  const page = resolvePageAppContext(target.page);

  const breadcrumbs = isPublicPage(target.page)
    ? resolveBreadcrumbsAppContext(appState, target.page)
    : [];

  const structuredData = isPublicPage(target.page)
    ? resolveStructuredDataAppContext(appState, target.page, breadcrumbs)
    : [];

  const content = resolveContentAppContext(target.page, appState);

  return new AppContext(
    deepFreeze({
      request: {
        url: url.toString(),
        method: req.method,
        pathname: url.pathname,
      },
      target,
      page,
      metadata: resolveMetadataAppContext(env, target.page),
      breadcrumbs,
      navigation: resolveNavigationAppContext(appState, page),
      branding: resolveBrandingAppContext(appState),
      siteIdentity: resolveSiteIdentityAppContext(appState),
      icons: resolveIconsAppContext(appState),
      assets: resolveAssetsAppContext(appState, target),
      pageFooter: resolvePageFooterAppContext(appState),
      structuredData,
      content,
    }),
  );
};
