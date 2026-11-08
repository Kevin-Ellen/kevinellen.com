// src/shared/types/assets/script-id.asset.shared.type.ts

import type { AUTHORED_SCRIPT_ASSETS } from "../../../app/assets/scripts/registry.scripts.assets";

export type ScriptAssetId = (typeof AUTHORED_SCRIPT_ASSETS)[number]["id"];
