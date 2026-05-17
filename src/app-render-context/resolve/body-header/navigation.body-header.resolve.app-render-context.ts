// src/app-render-context/resolve/body-header/navigation.body-header.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppRenderContextBodyHeaderNavigation } from "@app-render-context/types/body-header.app-render-context.types";

import { appRenderContextResolveLink } from "@app-render-context/shared/link.resolve.app-render-context";

const resolvePrimaryNavigation = (appContext: AppContext) => {
  const currentPath = appContext.canonicalUrl
    ? new URL(appContext.canonicalUrl).pathname
    : null;

  return appContext.navigation.header.primary.map((link) => {
    const resolved = appRenderContextResolveLink(appContext, link);

    const ariaCurrent: "page" | null =
      resolved.href === currentPath ? "page" : null;

    return {
      ...resolved,
      ariaCurrent,
    };
  });
};

const resolveSocialNavigation = (appContext: AppContext) => {
  return appContext.navigation.header.social.map((link) => {
    const resolved = appRenderContextResolveLink(appContext, link);

    return {
      ...resolved,
      ariaCurrent: null,
    };
  });
};

export const appRenderContextResolveBodyHeaderNavigation = (
  appContext: AppContext,
): AppRenderContextBodyHeaderNavigation => {
  return {
    primary: resolvePrimaryNavigation(appContext),
    social: resolveSocialNavigation(appContext),
  };
};
