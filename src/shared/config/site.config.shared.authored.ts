// src/shared/config/site.config.shared.authored.ts

import type { SiteConfigAuthored } from "../types/config/site.config.shared.authored.type";

export const siteConfigAuthored = {
  name: "Kevin Ellen",
  language: "en-GB",
  locale: "en-GB",
  titleSuffix: " | Kevin Ellen",
  description:
    "Wildlife and nature photography by Kevin Ellen, an Essex-based photographer documenting wildlife, landscapes and encounters with the natural world.",
  themeColor: "#1f2621",
  icons: {
    favicon: "/assets/icons/favicon.ico",
    svg: "/assets/icons/ke-monogram-logo.svg",
    appleTouch: "/assets/icons/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
} as const satisfies SiteConfigAuthored;
