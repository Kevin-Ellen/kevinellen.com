// src/app-state/resolve/pages/public/assets.resolve.app-state.ts

import type { AuthoredAssets } from "@shared-types/pages/shared/assets/authored.assets.shared.page.types";
import type { AppStateAssets } from "@shared-types/pages/shared/assets/app-state.assets.shared.page.types";

export const appStateResolvePageAssets = (
  assets: AuthoredAssets | undefined,
): AppStateAssets => {
  return {
    scripts: assets?.scripts ?? [],
    svg: assets?.svg ?? [],
  };
};
