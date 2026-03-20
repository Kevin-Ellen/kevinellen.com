// src/app/appState/init.appState.types.ts

import type { SiteConfig } from "@app/config/site.config.types";
import type { ScriptAsset } from "@app/assets/scripts/scripts.assets.types";
import type { SvgAsset } from "@app/assets/svgs/svgs.assets.types";
import type { CssAsset } from "@app/assets/css/css.assets.types";
import type { PageDefinition } from "@app/pages/page.definition";

export interface AppAssets {
  css: CssAsset;
  scripts: readonly ScriptAsset[];
  svgs: readonly SvgAsset[];
}

export type ErrorPageStatus = 404 | 500;

export type ErrorPages = Record<ErrorPageStatus, PageDefinition>;

export interface Pages {
  all: readonly PageDefinition[];
  errors: ErrorPages;
}

export interface AppStateInit {
  siteConfig: SiteConfig;
  appAssets: AppAssets;
  pages: Pages;
}
