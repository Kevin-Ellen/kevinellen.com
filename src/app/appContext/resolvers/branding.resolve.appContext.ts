// src/app/appContext/resolvers/branding.resolve.appContext.ts

import type { AppContextBranding } from "@app/appContext/appContext.types";
import type { AppState } from "@app/appState/class.appState";

export const resolveBrandingAppContext = (
  appState: AppState,
): AppContextBranding => {
  const branding = appState.site.headerBranding;

  return {
    homeHref: branding.homeHref,
    ariaLabel: branding.ariaLabel,
    logo: {
      type: "inline-svg",
      id: branding.logo.svg,
    },
  };
};
