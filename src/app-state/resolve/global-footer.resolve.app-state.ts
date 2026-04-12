// src/app-state/resolve/global-footer.resolve.app-state.ts

import { appStateGlobalFooterAuthored } from "@app-state/config/global-footer/authored.global-footer.app-state";
import { AppStateSiteConfig } from "@shared-types/config/site-config/app-state.site-config.types";
import type {
  AppStateGlobalFooter,
  AppStateGlobalFooterColophon,
} from "@shared-types/modules/global-footer/app-state.global-footer.module.types";

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
