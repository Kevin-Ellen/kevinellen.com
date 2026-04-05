// src/app/appContext/create.appContext.ts

import type { AppState } from "@app/appState/class.appState";
import type { DocumentRenderTarget } from "@app/request/request.document.types";

import { AppContext } from "@app/appContext/class.appContext";
import { resolveBreadcrumbsAppContext } from "@app/appContext/resolvers/breadcrumbs.resolve.appContext";
import { resolveCanonicalUrl } from "@app/appContext/resolvers/canonical.resolve.appContext";
import { resolveNavigationAppContext } from "@app/appContext/resolvers/navigation.resolve.appContext";

import { deepFreeze } from "@utils/deepFreeze.util";

export const createAppContext = (
  req: Request,
  env: Env,
  appState: AppState,
  target: DocumentRenderTarget,
): AppContext => {
  const url = new URL(req.url);

  return new AppContext(
    deepFreeze({
      request: {
        url: url.toString(),
        method: req.method,
        pathname: url.pathname,
      },
      target,
      page: target.page,
      metadata: {
        canonicalUrl: resolveCanonicalUrl(env, target.page),
      },
      breadcrumbs: resolveBreadcrumbsAppContext(appState, target.page),
      navigation: resolveNavigationAppContext(appState, target.page),
    }),
  );
};
