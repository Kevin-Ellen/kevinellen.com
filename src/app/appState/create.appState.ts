// src/app/appState/create.appState.ts

import type { AppStateConfig } from "@app/appState/appState.types";
import type {
  ErrorPageDefinition,
  PageDefinition,
} from "@app/pages/page.definition";

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

import { homePage } from "@app/pages/public/home.page";
import { error404Page } from "@app/pages/error/404.error.page";
import { GONE_RULES } from "@config/gone.config";

const publicPages: readonly PageDefinition[] = [homePage];
const errorPages: readonly ErrorPageDefinition[] = [error404Page];

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
      publicPages,
      errorPages,
    },
  };

  return new AppState(deepFreeze(state));
};
