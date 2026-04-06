// src/config/site.config.types.ts

import { SvgAssetId } from "@shared-types/assets/id.asset.types";
import type { SiteAssetReferences } from "@app/config/assets.config.types";

export type HeaderBrandingConfig = {
  homeHref: string;
  ariaLabel: string;
  logo: {
    type: "inline-svg";
    svg: SvgAssetId;
  };
};

export type SiteConfig = {
  siteName: string;
  siteUrl: string;
  language: string;
  headerBranding: HeaderBrandingConfig;
  assets: SiteAssetReferences;
};
