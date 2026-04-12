// src/app-state/resolve/assets.resolve.appState.ts

import type { AppStateAssets } from "@shared-types/assets/app-state.assets.types";

import { AUTHORED_SCRIPT_ASSETS } from "@app-state/config/assets/authored.scripts.assets.app-state";
import { AUTHORED_SVG_ASSETS } from "@app-state/config/assets/authored.svg.assets.app-state";

import { deepFreeze } from "@utils/deepFreeze.util";

export const appStateResolveAssets: AppStateAssets = deepFreeze({
  scripts: AUTHORED_SCRIPT_ASSETS,
  svg: AUTHORED_SVG_ASSETS,
});
