// src/app/appContext/resolvers/siteIdentity.resolve.appContext.ts

import type { AppContextSiteIdentity } from "@app/appContext/appContext.types";
import type { AppState } from "@app/appState/class.appState";

export const resolveSiteIdentityAppContext = (
  appState: AppState,
): AppContextSiteIdentity => {
  return {
    language: appState.site.language,
    siteName: appState.site.siteName,
  };
};
