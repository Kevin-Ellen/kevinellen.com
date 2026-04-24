// src/app-state/resolve/pages/public/assets.resolve.app-state.ts

import type { AuthoredAssets } from "@shared-types/page-definitions/assets/authored.assets.page-definition.types";
import type { AppStateAssets } from "@shared-types/assets/app-state.assets.types";

export const appStateResolvePageAssets = (
  assets: AuthoredAssets | undefined,
): AppStateAssets => {
  return {
    scripts: assets?.scripts ?? [],
    svg: assets?.svg ?? [],
  };
};
