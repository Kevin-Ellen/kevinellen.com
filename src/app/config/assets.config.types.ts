// src/app/config/assets.config.types.ts

import type { ScriptAssetAuthored } from "@shared-types/assets/script.asset.authored.types";
import type { SvgAssetAuthored } from "@shared-types/assets/svg.asset.authored.types";
import type { ScriptAssetId } from "@shared-types/assets/id.asset.types";
import type { SvgAssetId } from "@shared-types/assets/id.asset.types";

export type AssetsConfig = {
  scripts: readonly ScriptAssetAuthored[];
  svgs: readonly SvgAssetAuthored[];
};

export type SiteAssetReferences = {
  scripts: readonly ScriptAssetId[];
  svgs: readonly SvgAssetId[];
};
