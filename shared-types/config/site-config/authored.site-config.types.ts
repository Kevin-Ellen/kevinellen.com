// shared-types/config/site-config/authored.site-config.types.ts

import type { SiteLanguage } from "@shared-types/language/language.types";
import type { SvgAssetId } from "@shared-types/assets/svg/id.svg.assets.types";
import type { ScriptAssetId } from "@shared-types/assets/scripts/id.scripts.assets.types";

export type AuthoredSiteConfigHeaderBrandingLogo = Readonly<{
  type: "inline-svg";
  svg: SvgAssetId;
}>;

export type AuthoredSiteConfigHeaderBranding = Readonly<{
  homeHref: string;
  ariaLabel: string;
  logo: AuthoredSiteConfigHeaderBrandingLogo;
}>;

export type AuthoredSiteConfigHeadAssets = Readonly<{
  faviconIco: Readonly<{
    href: "/favicon.ico";
  }>;
  faviconSvg: Readonly<{
    href: `/assets/icons/${string}.svg`;
    type: "image/svg+xml";
  }>;
  faviconPng: Readonly<{
    href: `/assets/icons/${string}.png`;
    sizes: string;
    type: "image/png";
  }>;
  appleTouchIcon: Readonly<{
    href: "/apple-touch-icon.png";
  }>;
  manifest: Readonly<{
    href: "/manifest.webmanifest";
  }>;
}>;

export type AuthoredSiteConfigAssets = Readonly<{
  scripts: readonly ScriptAssetId[];
  svgs: readonly SvgAssetId[];
}>;

export type AuthoredSiteConfig = Readonly<{
  siteName: string;
  author: string;
  description: string;
  language: SiteLanguage;
  headerBranding: AuthoredSiteConfigHeaderBranding;
  headAssets: AuthoredSiteConfigHeadAssets;
  assets: AuthoredSiteConfigAssets;
}>;
