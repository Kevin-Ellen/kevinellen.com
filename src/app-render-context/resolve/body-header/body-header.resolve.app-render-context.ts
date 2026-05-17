// src/app-render-context/resolve/body-header/body-header.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppRenderContextBodyHeader } from "@app-render-context/types/body-header.app-render-context.types";

import { appRenderContextResolveBodyHeaderBranding } from "@app-render-context/resolve/body-header/branding.body-header.resolve.app-render-context";
import { appRenderContextResolveBodyHeaderBreadcrumbs } from "@app-render-context/resolve/body-header/breadcrumbs.body-header.resolve.app-render-context";
import { appRenderContextResolveBodyHeaderNavigation } from "@app-render-context/resolve/body-header/navigation.body-header.resolve.app-render-context";

export const appRenderContextResolveBodyHeader = (
  appContext: AppContext,
): AppRenderContextBodyHeader => ({
  branding: appRenderContextResolveBodyHeaderBranding(appContext),
  navigation: appRenderContextResolveBodyHeaderNavigation(appContext),
  breadcrumbs: appRenderContextResolveBodyHeaderBreadcrumbs(appContext),
});
