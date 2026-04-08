// src/config/site.config.ts

import type { SiteConfig } from "@config/site.config.types";

import { deepFreeze } from "@utils/deepFreeze.util";

export const siteConfig: SiteConfig = deepFreeze({
  siteName: "Kevin Ellen",
  siteUrl: "https://kevinellen.com",
  language: "en-GB",

  headerBranding: {
    homeHref: "/",
    ariaLabel: "Kevin Ellen home",
    logo: {
      type: "inline-svg",
      svg: "logo-monogram-ke",
    },
  },

  icons: {
    faviconIco: {
      href: "/assets/icons/favicon.ico",
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
});
