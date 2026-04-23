// src/app-render-context/resolve/body-header/branding.resolve.body-header.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppRenderContextBodyHeaderBranding } from "@app-render-context/types/body-header.app-render-context.types";

import { resolveSvgReferencesAppRenderContext } from "@app-render-context/shared/svg.resolve.app-render-context";

const resolveSvgReference = (appContext: AppContext, svgId: string) => {
  const svg = resolveSvgReferencesAppRenderContext(appContext).find(
    (item) => item.id === svgId,
  );

  if (!svg) {
    throw new Error(`Missing SVG asset: ${svgId}`);
  }

  return svg;
};

export const resolveBrandingBodyHeaderAppRenderContext = (
  appContext: AppContext,
): AppRenderContextBodyHeaderBranding => {
  const branding = appContext.headerBranding;

  return {
    href: branding.homeHref,
    ariaLabel: branding.ariaLabel,
    logo: resolveSvgReference(appContext, branding.logo.svg),
  };
};
