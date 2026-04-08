// src/config/webmanifest.config.ts

import type { WebManifestConfig } from "@config/webmanifest.config.types";
import { siteConfig } from "@config/site.config";

import { deepFreeze } from "@utils/deepFreeze.util";

export const webManifestConfig: WebManifestConfig = deepFreeze({
  id: "/",
  name: siteConfig.siteName,
  shortName: siteConfig.siteName,
  startUrl: siteConfig.headerBranding.homeHref,
  scope: "/",
  description:
    "Wildlife photography, field notes, and technical work exploring nature and digital publishing.",
  themeColor: "#1f2621",
  backgroundColor: "#1f2621",
  display: "standalone",
  icons: [
    {
      src: "/assets/icons/web-app-manifest-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "/assets/icons/web-app-manifest-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
  ],
});
