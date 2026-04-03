// src/app/appContext/resolvers/assets.resolve.appContext.ts

import type { AppContextAssets } from "@app/appContext/appContext.types";
import type { AppState } from "@app/appState/class.appState";
import type { DocumentRenderTarget } from "@app/request/request.document.types";
import type {
  ScriptAssetConfig,
  SvgAssetConfig,
} from "@config/assets.config.types";

const mergeById = <T extends { id: string }>(
  globalItems: readonly T[],
  pageItems: readonly T[],
): readonly T[] => {
  const merged = new Map<string, T>();

  for (const item of globalItems) {
    merged.set(item.id, item);
  }

  for (const item of pageItems) {
    merged.set(item.id, item);
  }

  return [...merged.values()];
};

export const resolveAssetsAppContext = (
  appState: AppState,
  target: DocumentRenderTarget,
): AppContextAssets => {
  const globalAssets = appState.getAssetsConfig();
  const pageAssets = target.page.assets;

  const scripts = mergeById<ScriptAssetConfig>(
    globalAssets.scripts,
    pageAssets.scripts,
  );

  const svgs = mergeById<SvgAssetConfig>(globalAssets.svgs, pageAssets.svgs);

  return {
    scripts,
    svgs,
  };
};
