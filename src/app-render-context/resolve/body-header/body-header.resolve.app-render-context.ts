// src/app-render-context/resolve/body-header/body-header.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppRenderContextBodyHeader } from "@app-render-context/types/body-header.app-render-context.types";

import { resolveBrandingBodyHeaderAppRenderContext } from "@app-render-context/resolve/body-header/branding.resolve.body-header.app-render-context";

import { resolveNavigationBodyHeaderAppRenderContext } from "@app-render-context/resolve/body-header/navigation.resolve.body-header.app-render-context";

import { resolveBreadcrumbsAppRenderContext } from "@app-render-context/resolve/body-header/breadcrumbs.resolve.app-render-context";

export const resolveBodyHeaderAppRenderContext = (
  appContext: AppContext,
): AppRenderContextBodyHeader => {
  return {
    branding: resolveBrandingBodyHeaderAppRenderContext(appContext),
    navigation: resolveNavigationBodyHeaderAppRenderContext(appContext),
    breadcrumbs: resolveBreadcrumbsAppRenderContext(appContext),
  };
};
