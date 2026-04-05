// src/app/config/assets.config.types.ts

import type { ScriptAssetAuthored } from "@shared-types/assets/script.asset.authored.types";
import type { SvgAssetAuthored } from "@shared-types/assets/svg.asset.authored.types";

export type AssetsConfig = {
  scripts: readonly ScriptAssetAuthored[];
  svgs: readonly SvgAssetAuthored[];
};
