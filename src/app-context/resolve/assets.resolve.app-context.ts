// src/app-context/resolve/assets.resolve.app-context.ts

import type { AppContextAssets } from "@shared-types/assets/app-context.assets.types";
import type { AppStateAssets } from "@shared-types/assets/app-state.assets.types";
import type { AppContextScriptAsset } from "@shared-types/assets/scripts/app-context.scripts.assets.types";
import type { AppContextSvgAsset } from "@shared-types/assets/svg/app-context.svg.assets.types";

const mergeScripts = (
  globalScripts: readonly AppContextScriptAsset[],
  pageScripts: readonly AppContextScriptAsset[],
): readonly AppContextScriptAsset[] => {
  const seen = new Set<string>();

  return [...globalScripts, ...pageScripts].filter((script) => {
    if (seen.has(script.id)) {
      return false;
    }

    seen.add(script.id);
    return true;
  });
};

const mergeSvgs = (
  globalSvgs: readonly AppContextSvgAsset[],
  pageSvgs: readonly AppContextSvgAsset[],
): readonly AppContextSvgAsset[] => {
  const seen = new Set<string>();

  return [...globalSvgs, ...pageSvgs].filter((svg) => {
    if (seen.has(svg.id)) {
      return false;
    }

    seen.add(svg.id);
    return true;
  });
};

export const resolveAssetsAppContext = (
  globalAssets: AppStateAssets,
  pageAssets: AppStateAssets,
): AppContextAssets => {
  return {
    scripts: mergeScripts(globalAssets.scripts, pageAssets.scripts),
    svg: mergeSvgs(globalAssets.svg, pageAssets.svg),
  };
};
