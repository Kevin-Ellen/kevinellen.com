// src/config/webmanifest.config.types.ts

export type WebManifestDisplay =
  | "standalone"
  | "browser"
  | "fullscreen"
  | "minimal-ui";

export type WebManifestIconConfig = {
  src: string;
  sizes: string;
  type: "image/png";
};

export type WebManifestConfig = {
  id: string;
  name: string;
  shortName: string;
  startUrl: string;
  scope: string;
  description: string;
  themeColor: string;
  backgroundColor: string;
  display: WebManifestDisplay;
  icons: readonly WebManifestIconConfig[];
};
