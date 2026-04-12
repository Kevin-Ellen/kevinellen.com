// shared-types/config/site-config/authored.site-config.types.ts

import type { SiteLanguage } from "@shared-types/language/language.types";
import type { SvgAssetId } from "@shared-types/assets/svg/id.svg.assets.types";
import type { ScriptAssetId } from "@shared-types/assets/scripts/id.scripts.assets.types";

export type AuthoredSiteConfigHeaderBranding = {
  homeHref: string;
  ariaLabel: string;
  logo: {
    type: "inline-svg";
    svg: SvgAssetId; //SvgAssetId;
  };
};

export type AuthoredSiteConfigHeadAssets = {
  faviconIco: {
    href: "/favicon.ico";
  };
  faviconSvg: {
    href: `/assets/icons/${string}.svg`;
    type: "image/svg+xml";
  };
  faviconPng: {
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

type SiteConfigAuthoredAssets = {
  scripts: readonly ScriptAssetId[];
  svgs: readonly SvgAssetId[];
};

export type AuthoredSiteConfig = {
  siteName: string;
  author: string;
  description: string;
  language: SiteLanguage;
  headerBranding: AuthoredSiteConfigHeaderBranding;
  headAssets: AuthoredSiteConfigHeadAssets;
  assets: SiteConfigAuthoredAssets; //SiteAssetReferences;
};
