// src/app-state/resolve/global-footer.resolve.app-state.ts

import type { AppStateSiteConfig } from "@shared-types/config/site-config/app-state.site-config.types";

import type {
  AppStateGlobalFooter,
  AppStateGlobalFooterColophon,
} from "@shared-types/page-content/site/global-footer/app-state.global-footer.page-content.types";

import { appStateGlobalFooterAuthored } from "@app-state/config/global-footer/authored.global-footer.app-state";

const resolveColophon = (
  siteConfig: AppStateSiteConfig,
): AppStateGlobalFooterColophon => {
  return {
    kind: "colophon",
    copyrightName: siteConfig.siteName,
    copyrightYear: new Date().getFullYear(),
    allRightsReserved: true,
  };
};

export const appStateResolveGlobalFooter = (
  siteConfig: AppStateSiteConfig,
): AppStateGlobalFooter => {
  return {
    ...appStateGlobalFooterAuthored,
    colophon: resolveColophon(siteConfig),
  };
};
