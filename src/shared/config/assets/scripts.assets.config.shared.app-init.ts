// src/shared/config/assets/scripts.assets.config.shared.app-init.ts

import type { ScriptsAssetsConfigAuthored } from "../../types/assets/scripts.assets.config.authored.type";

import { AUTHORED_SCRIPT_ASSETS } from "../../../app/assets/scripts/registry.scripts.assets";

export const scriptsAssetsConfigAuthored = {
  registry: Object.fromEntries(
    AUTHORED_SCRIPT_ASSETS.map((asset) => [asset.id, asset]),
  ),
  global: ["header-headroom"],
} as ScriptsAssetsConfigAuthored;
