// shared-types/pages/shared/assets/app-state.assets.shared.page.types.ts

import { AppStateSvgAssets } from "@shared-types/assets/svg/app-state.svg.assets.types";
import { AppStateScriptAssets } from "@shared-types/assets/scripts/app-state.scripts.assets.types";

export type AppStateAssets = Readonly<{
  svg: AppStateSvgAssets;
  scripts: AppStateScriptAssets;
}>;
