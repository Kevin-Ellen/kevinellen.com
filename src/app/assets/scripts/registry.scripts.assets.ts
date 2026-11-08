// src/app/assets/scripts/registry.scripts.assets.ts

import type { ScriptAssetAuthored } from "../../../content-schema/assets/script.asset.content-schema.authored.type";

import { HEADER_HEADROOM_SCRIPT } from "./generated/header-headroom.script";

export const AUTHORED_SCRIPT_ASSETS = [
  {
    id: "header-headroom",
    kind: "inline",
    content: HEADER_HEADROOM_SCRIPT,
    location: "end",
  },
] as const satisfies readonly ScriptAssetAuthored[];
