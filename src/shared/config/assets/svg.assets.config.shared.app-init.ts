// src/shared/config/assets/svg.assets.config.shared.app-init.ts

import type { SvgAssetsConfigAuthored } from "../../../app/types/config/assets/svg.assets.config.authored.type";

import { AUTHORED_SVG_ASSETS } from "../../../app/assets/svg/registry.svg.assets";

export const svgAssetsConfigAuthored = Object.fromEntries(
  AUTHORED_SVG_ASSETS.map((asset) => [asset.id, asset]),
) as SvgAssetsConfigAuthored;
