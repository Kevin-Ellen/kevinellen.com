// src/app-state/config/assets/authored.scripts.assets.app-state.ts

import type { AuthoredScriptAsset } from "@shared-types/assets/scripts/authored.scripts.assets.types";

import { HEADER_CONDENSE_SCRIPT } from "@assets/scripts/generated/header-condense.script";

export const AUTHORED_SCRIPT_ASSETS: readonly AuthoredScriptAsset[] = [
  {
    id: "header-condense",
    kind: "inline",
    content: HEADER_CONDENSE_SCRIPT,
    location: "footer",
  },
];
