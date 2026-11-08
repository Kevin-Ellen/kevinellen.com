// src/shared/types/assets/svg-id.asset.shared.type.ts

import type { AUTHORED_SVG_ASSETS } from "../../../app/assets/svg/registry.svg.assets";

export type SvgAssetId = (typeof AUTHORED_SVG_ASSETS)[number]["id"];
