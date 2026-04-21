// shared-types/config/site-config/app-state.site-config.types.ts

import type { AuthoredSiteConfig } from "@shared-types/config/site-config/authored.site-config.types";

type AppStateSiteConfigRuntime = Readonly<{
  origin: string;
  host: string;
}>;

export type AppStateSiteConfig = Readonly<
  AuthoredSiteConfig & AppStateSiteConfigRuntime
>;

export type AppStateHeadAssets = AppStateSiteConfig["headAssets"];
