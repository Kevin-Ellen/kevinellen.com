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

export type SiteIconsConfig = {
  faviconIco: {
    href: "/assets/icons/favicon.ico";
  };
  faviconSvg?: {
    href: `/assets/icons/${string}.svg`;
    type: "image/svg+xml";
  };
  faviconPng?: {
    href: `/assets/icons/${string}.png`;
    sizes: string;
    type: "image/png";
  };
  appleTouchIcon: {
    href: "/apple-touch-icon.png";
  };
  manifest: {
    href: "/manifest.webmanifest";
  };
};

export type SiteConfig = {
  siteName: string;
  siteUrl: string;
  language: string;
  headerBranding: HeaderBrandingConfig;
  icons: SiteIconsConfig;
  assets: SiteAssetReferences;
};
