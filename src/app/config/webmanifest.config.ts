// src/config/webmanifest.config.ts

import type { WebManifestConfig } from "@config/webmanifest.config.types";

import { deepFreeze } from "@utils/deepFreeze.util";

export const webManifestConfig: WebManifestConfig = deepFreeze({
  name: "Kevin Ellen",
  shortName: "Kevin Ellen",
  description:
    "Wildlife photography, field notes, and technical work exploring nature and digital publishing.",
  themeColor: "#1f2621",
  backgroundColor: "#1f2621",
  display: "standalone",
});
