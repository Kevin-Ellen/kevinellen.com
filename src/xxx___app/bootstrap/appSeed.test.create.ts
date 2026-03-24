// src/app/bootstrap/appSeed.test.create.ts

import type { AppStateInit } from "@app/appState/appState.types";

import { siteConfig } from "@app/config/site.config";
import { appScripts } from "@app/assets/scripts/global.scripts.assets";
import { appSvgs } from "@app/assets/svgs/global.svgs.assets";

import {
  STATIC_PAGE_REGISTRY,
  ERROR_PAGE_REGISTRY,
} from "@src/app/pages/page.registry";

export const createTestAppSeed = async (): Promise<AppStateInit> => {
  return {
    siteConfig,
    appAssets: {
      css: "",
      scripts: appScripts,
      svgs: appSvgs,
    },
    pages: {
      all: STATIC_PAGE_REGISTRY,
      errors: ERROR_PAGE_REGISTRY,
    },
  };
};
