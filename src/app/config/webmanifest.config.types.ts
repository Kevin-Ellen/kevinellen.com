// src/config/webmanifest.config.types.ts

export type WebManifestDisplay =
  | "standalone"
  | "browser"
  | "fullscreen"
  | "minimal-ui";

export type WebManifestConfig = {
  name: string;
  shortName: string;
  description: string;
  themeColor: string;
  backgroundColor: string;
  display: WebManifestDisplay;
};
