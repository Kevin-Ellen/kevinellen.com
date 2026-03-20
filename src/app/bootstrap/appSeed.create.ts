// src/app/bootstrap/appSeed.create.ts

import type { AppStateInit } from "@app/appState/appState.types";

import css from "../../../.build/generated/styles.css?raw";

import { siteConfig } from "@app/config/site.config";
import { appScripts } from "@app/assets/scripts/global.scripts.assets";
import { appSvgs } from "@app/assets/svgs/global.svgs.assets";

import { STATIC_PAGE_REGISTRY } from "@src/app/pages/page.registry";
import { ERROR_PAGE_REGISTRY } from "@src/app/pages/page.registry";

export const createAppSeed = async (): Promise<AppStateInit> => {
  return {
    siteConfig: siteConfig,
    appAssets: {
      scripts: appScripts,
      css: css,
      svgs: appSvgs,
    },
    pages: {
      all: STATIC_PAGE_REGISTRY,
      errors: ERROR_PAGE_REGISTRY,
    },
  };
};
