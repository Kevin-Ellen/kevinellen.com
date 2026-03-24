// src/app/system/webmanifest/webmanifest.types.ts

import type { WebManifestConfig } from "@config/webmanifest.config.types";

export type WebManifestIcon = {
  readonly src: string;
  readonly sizes: string;
  readonly type: string;
};

export type WebManifestDocument = Pick<
  WebManifestConfig,
  | "name"
  | "shortName"
  | "description"
  | "display"
  | "backgroundColor"
  | "themeColor"
> & {
  readonly startUrl: string;
  readonly icons: readonly WebManifestIcon[];
};
