// src/app-render-context/types/body-footer.app-render-context.types.ts

import type { AppRenderContextFooterNavigation } from "@shared-types/config/navigation/footer/app-render-context.footer.navigation.types";
import type { AppRenderContextSvgReference } from "@shared-types/assets/svg/app-render-context.svg.assets.types";

export type AppRenderContextBodyFooterAffiliations = Readonly<{
  items: readonly AppRenderContextBodyFooterAffiliation[];
}>;

export type AppRenderContextBodyFooterAffiliation = Readonly<{
  ariaLabel: string;
  href: string;
  logo: AppRenderContextSvgReference;
}>;

export type AppRenderContextBodyFooterColophon = Readonly<{
  items: readonly AppRenderContextBodyFooterColophonItem[];
}>;

export type AppRenderContextBodyFooterColophonItem = Readonly<{
  label: string;
  value: string;
}>;

export type AppRenderContextBodyFooter = Readonly<{
  nav: AppRenderContextFooterNavigation;
  affiliations: AppRenderContextBodyFooterAffiliations;
  colophon: AppRenderContextBodyFooterColophon;
}>;
