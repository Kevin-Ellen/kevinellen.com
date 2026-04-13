// src/app-state/config/webmanifest/authored.webmanifest.appState.ts

import { deepFreeze } from "@utils/deepFreeze.util";

import type { AuthoredWebManifest } from "@shared-types/config/webmanifest/authored.webmanifest.types";

export const appStateWebManifestAuthored: AuthoredWebManifest = deepFreeze({
  shortName: "KevinE",
  themeColor: "#1f2621",
  backgroundColor: "#1f2621",
  display: "minimal-ui",
});
