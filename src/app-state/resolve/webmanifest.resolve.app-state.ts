// src/app-state/resolve/webmanifest.resolve.app-state.ts

import type { AppStateWebmanifest } from "@shared-types/config/webmanifest/app-state.webmanifest.types";
import type { AppStateSiteConfig } from "@shared-types/config/site-config/app-state.site-config.types";

import { appStateWebManifestAuthored } from "@app-state/config/webmanifest/authored.webmanifest.app-state";
import { deepFreeze } from "@utils/deepFreeze.util";

export const appStateResolveWebmanifest = (
  appStateSiteConfig: AppStateSiteConfig,
): AppStateWebmanifest => {
  const startUrl = `${appStateSiteConfig.origin}${appStateSiteConfig.headerBranding.homeHref}`;

  return deepFreeze({
    ...appStateWebManifestAuthored,
    name: appStateSiteConfig.siteName,
    scope: appStateSiteConfig.headerBranding.homeHref,
    description: appStateSiteConfig.description,
    startUrl,
    display: "minimal-ui",
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
};
