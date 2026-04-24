// shared-types/config/site-config/app-state.site-config.types.ts

import type { AuthoredSiteConfig } from "@shared-types/config/site-config/authored.site-config.types";
import type { AuthoredSiteConfigHeadAssetPreload } from "@shared-types/config/site-config/authored.site-config.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppStateSiteConfigRuntime = Readonly<{
  origin: string;
  host: string;
}>;

type AppStateSiteConfigDeterministicFields = Readonly<{
  preload: readonly AuthoredSiteConfigHeadAssetPreload[];
}>;

export type AppStateSiteConfig = Replace<
  AuthoredSiteConfig & AppStateSiteConfigRuntime,
  AppStateSiteConfigDeterministicFields
>;

export type AppStateHeadAssets = AppStateSiteConfig["headAssets"];
export type AppStateHeaderBranding = AppStateSiteConfig["headerBranding"];
export type AppStatePreload = AppStateSiteConfig["preload"];
