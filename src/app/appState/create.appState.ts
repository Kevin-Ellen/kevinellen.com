// src/app/appState/create.appState.ts

import type { AppStateSeed } from "@app/appState/appState.types";

import { AppState } from "@app/appState/appState";
import { siteConfig } from "@config/site.config";
import { navigationConfig } from "@config/navigation.config";
import { socialConfig } from "@config/social.config";
import { structuredDataConfig } from "@config/structured-data.config";
import { assetsConfig } from "@config/assets.config";
import { footerConfig } from "@config/footer.config";
import { webManifestConfig } from "@config/webmanifest.config";

import { REGISTRY_PUBLIC_PAGES } from "@app/pages/registry/public.registry.pages";
import { REGISTRY_ERROR_PAGES } from "@app/pages/registry/error.registry.pages";

const createSeed = (): AppStateSeed => {
  return {
    site: siteConfig,
    navigation: navigationConfig,
    social: socialConfig,
    structuredData: structuredDataConfig,
    assets: assetsConfig,
    footer: footerConfig,
    webmanifest: webManifestConfig,
    pages: {
      public: REGISTRY_PUBLIC_PAGES,
      error: REGISTRY_ERROR_PAGES,
    },
  };
};

export const createAppState = (): AppState => new AppState(createSeed());
