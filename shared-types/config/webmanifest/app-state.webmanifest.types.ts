// shared-types/config/webmanifest/app-state.webmanifest.types.ts

import type { AuthoredWebManifest } from "@shared-types/config/webmanifest/authored.webmanifest.types";

type AppStateWebManifestIconConfig = Readonly<{
  src: string;
  sizes: string;
  type: "image/png";
}>;

type AppStateWebManifestRuntime = Readonly<{
  name: string;
  startUrl: string;
  scope: string;
  description: string;
  icons: readonly AppStateWebManifestIconConfig[];
}>;

export type AppStateWebManifest = Readonly<
  AuthoredWebManifest & AppStateWebManifestRuntime
>;
