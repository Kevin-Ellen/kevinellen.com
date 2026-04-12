// shared-types/assets/app-state.assets.types.ts

import type { AppStateSvgAssets } from "@shared-types/assets/svg/app-state.svg.assets.types";
import type { AppStateScriptAssets } from "@shared-types/assets/scripts/app-state.scripts.assets.types";

export type AppStateAssets = {
  svg: AppStateSvgAssets;
  scripts: AppStateScriptAssets;
};
