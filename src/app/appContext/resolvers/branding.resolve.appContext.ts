// src/app/appContext/resolvers/branding.resolve.appContext.ts

import type { AppContextBranding } from "@app/appContext/appContext.types";
import type { AppState } from "@app/appState/class.appState";

export const resolveBrandingAppContext = (
  appState: AppState,
): AppContextBranding => {
  const { headerBranding } = appState.getSiteConfig();

  return Object.freeze({
    header: {
      href: headerBranding.homeHref,
      ariaLabel: headerBranding.ariaLabel,
      logoSvgId: headerBranding.logo.svg,
    },
  });
};
