// src/shared/resolvers/assets/asset.resolver.shared.app-init.ts

import type { SvgAssetAppInit } from "../../types/assets/svg.asset.shared.app-init.type";
import type { SvgAssetId } from "../../types/assets/svg-id.asset.shared.type";

import type { ScriptsAssetsConfigAppInit } from "../../types/config/scripts.assets.config.shared.app-init.type";

import { svgAssetsConfigAuthored } from "../../config/assets/svg.assets.config.shared.app-init";
import { scriptsAssetsConfigAuthored } from "../../config/assets/scripts.assets.config.shared.app-init";

import { resolveSvgAssetsConfigAppInit } from "./svg/svg.asset.app-init";
import { resolveScriptsAssetConfigAppInit } from "./scripts/scripts.asset.resolver.app-init";

export type AssetConfigAppInit = Readonly<{
  svg: Readonly<Record<SvgAssetId, SvgAssetAppInit>>;
  scripts: ScriptsAssetsConfigAppInit;
}>;

export const resolveAssetConfigAppInit = (): AssetConfigAppInit => {
  const svg = resolveSvgAssetsConfigAppInit({
    authored: svgAssetsConfigAuthored,
  });

  const scripts = resolveScriptsAssetConfigAppInit({
    authored: scriptsAssetsConfigAuthored,
  });

  return {
    svg,
    scripts,
  };
};
