// shared-types/config/webmanifest/app-state.webmanifest.types.ts

import type { WebManifestAuthored } from "@shared-types/config/webmanifest/authored.webmanifest.types";

type AppStateWebManifestDisplay =
  | "standalone"
  | "browser"
  | "fullscreen"
  | "minimal-ui";

type AppStateWebManifestIconConfig = {
  src: string;
  sizes: string;
  type: "image/png";
};

export type AppStateWebmanifest = WebManifestAuthored & {
  name: string;
  startUrl: string;
  scope: string;
  description: string;
  display: AppStateWebManifestDisplay;
  icons: readonly AppStateWebManifestIconConfig[];
};
