// src/app/system/webmanifest/build.webmanifest.ts

import type { AppState } from "@app/appState/appState";
import type { WebManifestDocument } from "@app/system/webmanifest/webmanifest.types";

export const buildWebManifest = (appState: AppState): WebManifestDocument => {
  const config = appState.getWebManifestConfig();

  return {
    name: config.name,
    shortName: config.shortName,
    description: config.description,
    startUrl: "/",
    display: config.display,
    backgroundColor: config.backgroundColor,
    themeColor: config.themeColor,
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
};
