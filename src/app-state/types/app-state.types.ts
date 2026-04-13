// src/app-state/types/app-state.types.ts

import type { AppStateSiteConfig } from "@shared-types/config/site-config/app-state.site-config.types";
import type { AppStateWebManifest } from "@shared-types/config/webmanifest/app-state.webmanifest.types";
import type { AppStateSystem } from "@shared-types/config/system/app-state.system.types";
import type { AppStateAssets } from "@shared-types/assets/app-state.assets.types";
import type { AppStateGlobalFooter } from "@shared-types/page-content/site/global-footer/app-state.global-footer.page-content.types";
import type { AppStateSocial } from "@shared-types/config/social/app-state.social.types";
import type { AppStateMetadataLabels } from "@shared-types/config/metadata-labels/app-state.metadata-labels.types";
import type { AppStateNavigation } from "@shared-types/config/navigation/app-state.navigation.types";
import type { AppStateStructuredData } from "@shared-types/config/structured-data/app-state.structured-data.types";

import type { AppStatePages } from "@app-state/types/pages.app-state.types";

export type AppStateData = {
  siteConfig: AppStateSiteConfig;
  system: AppStateSystem;
  webManifest: AppStateWebManifest;
  assets: AppStateAssets;
  globalFooter: AppStateGlobalFooter;
  social: AppStateSocial;
  metadataLabels: AppStateMetadataLabels;
  navigation: AppStateNavigation;
  structuredData: AppStateStructuredData;
  pages: AppStatePages;
};
