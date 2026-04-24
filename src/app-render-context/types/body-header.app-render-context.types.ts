// src/app-render-context/types/body-header.app-render-context.types.ts

import type { AppRenderContextSvgReference } from "@shared-types/assets/svg/app-render-context.svg.assets.types";
import type { AppRenderContextLink } from "@shared-types/links/app-render-context.links.types";
import type { AppRenderContextBreadcrumbs } from "@shared-types/breadcrumbs/app-render-context.breadcrumbs.types";

export type AppRenderContextBodyHeaderBranding = Readonly<{
  href: string;
  ariaLabel: string;
  logo: AppRenderContextSvgReference;
}>;

export type AppRenderContextBodyHeaderNavigationLink = Readonly<
  AppRenderContextLink & {
    ariaCurrent: "page" | null;
  }
>;

export type AppRenderContextBodyHeaderNavigation = Readonly<{
  primary: readonly AppRenderContextBodyHeaderNavigationLink[];
  social: readonly AppRenderContextBodyHeaderNavigationLink[];
}>;

export type AppRenderContextBodyHeader = Readonly<{
  branding: AppRenderContextBodyHeaderBranding;
  navigation: AppRenderContextBodyHeaderNavigation;
  breadcrumbs: AppRenderContextBreadcrumbs;
}>;
