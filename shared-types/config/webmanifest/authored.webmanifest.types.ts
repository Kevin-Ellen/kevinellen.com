// shared-types/config/webmanifest/authored.webmanifest.types.ts

type AuthoredWebManifestDisplay =
  | "standalone"
  | "browser"
  | "fullscreen"
  | "minimal-ui";

export type AuthoredWebManifest = Readonly<{
  shortName: string;
  themeColor: string;
  backgroundColor: string;
  display: AuthoredWebManifestDisplay;
}>;
