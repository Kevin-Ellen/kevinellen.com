// src/app/system/webmanifest/render.webmanifest.ts

import type { WebManifestDocument } from "@app/system/webmanifest/webmanifest.types";

export const renderWebManifest = (document: WebManifestDocument): string => {
  return JSON.stringify(document, null, 2);
};
