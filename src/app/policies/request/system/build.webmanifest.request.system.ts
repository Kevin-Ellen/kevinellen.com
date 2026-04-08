// src/app/policies/request/system/build.webmanifest.system.ts

import type { AppState } from "@app/appState/class.appState";

const toWebManifestSpec = (webManifest: AppState["webManifest"]) => {
  return {
    id: webManifest.id,
    name: webManifest.name,
    short_name: webManifest.shortName,
    start_url: webManifest.startUrl,
    scope: webManifest.scope,
    description: webManifest.description,
    theme_color: webManifest.themeColor,
    background_color: webManifest.backgroundColor,
    display: webManifest.display,
    icons: webManifest.icons,
  };
};

export const buildWebManifestSystem = (appState: AppState): string => {
  const manifest = toWebManifestSpec(appState.webManifest);

  return JSON.stringify(manifest, null, 2);
};
