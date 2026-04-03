// src/app/appState/create.appState.ts

import type { AppStateConfig } from "@app/appState/appState.types";

import { AppState } from "@app/appState/class.appState";

import { deepFreeze } from "@utils/deepFreeze.util";

import { siteConfig } from "@config/site.config";
import { assetsConfig } from "@config/assets.config";
import { footerConfig } from "@config/footer.config";
import { navigationConfig } from "@config/navigation.config";
import { socialConfig } from "@config/social.config";
import { structuredDataConfig } from "@config/structured-data.config";
import { webManifestConfig } from "@config/webmanifest.config";

import { REDIRECTS } from "@config/redirects.config";
import { GONE_RULES } from "@config/gone.config";

import { REGISTRY_PUBLIC_PAGES } from "@app/pages/registry/public.registry.pages";
import { REGISTRY_ERROR_PAGES } from "@app/pages/registry/error.registry.pages";

export const createAppState = (): AppState => {
  const state: AppStateConfig = {
    siteConfig,
    assetsConfig,
    footerConfig,
    navigationConfig,
    socialConfig,
    structuredDataConfig,
    webManifestConfig,
    redirectsConfig: REDIRECTS,
    goneConfig: GONE_RULES,
    pages: {
      publicPages: REGISTRY_PUBLIC_PAGES,
      errorPages: REGISTRY_ERROR_PAGES,
    },
  };

  return new AppState(deepFreeze(state));
};
