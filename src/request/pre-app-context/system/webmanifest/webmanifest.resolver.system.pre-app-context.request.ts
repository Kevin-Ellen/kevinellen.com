// src/request/pre-app-context/system/webmanifest/webmanifest.resolver.system.pre-app-context.request.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppStateWebManifest } from "@shared-types/config/webmanifest/app-state.webmanifest.types";

export const resolveWebmanifestSystem = (
  req: Request,
  appState: AppState,
): AppStateWebManifest | null => {
  const url = new URL(req.url);

  if (url.pathname !== "/manifest.webmanifest") {
    return null;
  }

  return appState.manifest;
};
