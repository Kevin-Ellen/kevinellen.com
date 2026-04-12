// shared-types/config/webmanifest/authored.webmanifest.types.ts

type WebManifestAuthoredDisplay =
  | "standalone"
  | "browser"
  | "fullscreen"
  | "minimal-ui";

export type WebManifestAuthored = {
  shortName: string;
  themeColor: string;
  backgroundColor: string;
  display: WebManifestAuthoredDisplay;
};
