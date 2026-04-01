// src/app/policies/request/system/build.webmanifest.system.ts

import type { AppState } from "@app/appState/class.appState";

export const buildWebManifestSystem = (appState: AppState): string => {
  return JSON.stringify(appState.getWebManifestConfig(), null, 2);
};
