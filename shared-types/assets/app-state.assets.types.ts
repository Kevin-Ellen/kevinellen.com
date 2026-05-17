// shared-types/assets/app-state.assets.types.ts

import type { AppStateSvgAsset } from "@shared-types/assets/svg/app-state.svg.assets.types";
import type { AppStateScriptAsset } from "@shared-types/assets/scripts/app-state.scripts.assets.types";

export type AppStateAssets = Readonly<{
  svg: readonly AppStateSvgAsset[];
  scripts: readonly AppStateScriptAsset[];
}>;
