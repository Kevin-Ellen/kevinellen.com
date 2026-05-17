// src/app-state/config/site-config/authored.site-config.app-state.ts

import type { AuthoredSiteConfig } from "@shared-types/config/site-config/authored.site-config.types";

import { deepFreeze } from "@utils/deepFreeze.util";

export const appStateSiteConfigAuthored: AuthoredSiteConfig = deepFreeze({
  siteName: "Kevin Ellen",
  author: "Kevin Ellen",
  language: "en-GB",
  description:
    "Wildlife photography, field notes, and technical work exploring nature and digital publishing.",

  headerBranding: {
    homeHref: "/",
    ariaLabel: "Kevin Ellen home",
    logo: {
      type: "inline-svg",
      svg: "logo-monogram-ke",
    },
  },

  headAssets: {
    faviconIco: {
      href: "/favicon.ico",
    },
    faviconSvg: {
      href: "/assets/icons/ke-monogram-logo.svg",
      type: "image/svg+xml",
    },
    faviconPng: {
      href: "/assets/icons/favicon-96x96.png",
      sizes: "96x96",
      type: "image/png",
    },
    appleTouchIcon: {
      href: "/apple-touch-icon.png",
    },
    manifest: {
      href: "/manifest.webmanifest",
    },
  },

  assets: {
    scripts: ["header-condense"],
    svgs: [
      "logo-monogram-ke",
      "icon-home",
      "icon-github",
      "icon-instagram",
      "icon-linkedin",
      "logo-rspb",
      "logo-national-trust",
      "logo-vogelbescherming-nederland",
    ],
  },

  preload: [
    {
      href: "/assets/fonts/source-sans/sourcesans3-regular.woff2",
      as: "font",
      type: "font/woff2",
      crossorigin: "anonymous",
    },
    {
      href: "/assets/fonts/source-sans/sourcesans3-semibold.woff2",
      as: "font",
      type: "font/woff2",
      crossorigin: "anonymous",
    },
    {
      href: "/assets/fonts/source-serif/sourceserif4-regular.woff2",
      as: "font",
      type: "font/woff2",
      crossorigin: "anonymous",
    },
  ],
});
