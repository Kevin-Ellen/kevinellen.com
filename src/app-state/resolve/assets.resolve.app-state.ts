// src/app-state/resolve/assets.resolve.appState.ts

import type { AppStateAssets } from "@shared-types/assets/app-state.assets.types";
import type { AuthoredScriptAsset } from "@shared-types/assets/scripts/authored.scripts.assets.types";
import type { AppStateScriptAsset } from "@shared-types/assets/scripts/app-state.scripts.assets.types";

import { AUTHORED_SCRIPT_ASSETS } from "@app-state/config/assets/authored.scripts.assets.app-state";
import { AUTHORED_SVG_ASSETS } from "@app-state/config/assets/authored.svg.assets.app-state";

import { deepFreeze } from "@utils/deepFreeze.util";

const trimInlineScriptContent = (content: string): string => {
  return content.trim();
};

const appStateResolveScriptAsset = (
  script: AuthoredScriptAsset,
): AppStateScriptAsset => {
  if (script.kind !== "inline") {
    return script;
  }

  return {
    ...script,
    content: trimInlineScriptContent(script.content),
  };
};

const appStateResolveScriptAssets = (
  scripts: readonly AuthoredScriptAsset[],
): readonly AppStateScriptAsset[] => {
  return scripts.map(appStateResolveScriptAsset);
};

export const appStateResolveAssets: AppStateAssets = deepFreeze({
  scripts: appStateResolveScriptAssets(AUTHORED_SCRIPT_ASSETS),
  svg: AUTHORED_SVG_ASSETS,
});
