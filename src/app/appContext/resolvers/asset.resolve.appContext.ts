// src/app/appContext/resolvers/asset.resolve.appContext.ts

import type { AppContextAssets } from "@app/appContext/appContext.types";
import type { AppState } from "@app/appState/class.appState";
import type { DocumentRenderTarget } from "@app/request/request.document.types";
import type { ScriptAssetAuthored } from "@shared-types/assets/script.asset.authored.types";
import type { SvgAssetAuthored } from "@shared-types/assets/svg.asset.authored.types";

const dedupeIds = (ids: readonly string[]): readonly string[] => {
  return [...new Set(ids)];
};

const resolveScriptAssetById = (
  appState: AppState,
  id: string,
): ScriptAssetAuthored => {
  const asset = appState.getScriptAssetById(id);

  if (!asset) {
    throw new Error(`Script asset not found for id: ${id}`);
  }

  return asset;
};

const resolveSvgAssetById = (
  appState: AppState,
  id: string,
): SvgAssetAuthored => {
  const asset = appState.getSvgAssetById(id);

  if (!asset) {
    throw new Error(`SVG asset not found for id: ${id}`);
  }

  return asset;
};

export const resolveAssetsAppContext = (
  appState: AppState,
  target: DocumentRenderTarget,
): AppContextAssets => {
  const globalScriptIds = appState.site.assets.scripts;
  const globalSvgIds = appState.site.assets.svgs;

  const pageScriptIds = target.page.assets?.scripts ?? [];
  const pageSvgIds = target.page.assets?.svgs ?? [];

  const mergedScriptIds = dedupeIds([...globalScriptIds, ...pageScriptIds]);
  const mergedSvgIds = dedupeIds([...globalSvgIds, ...pageSvgIds]);

  return {
    scripts: mergedScriptIds.map((id) => resolveScriptAssetById(appState, id)),
    svgs: mergedSvgIds.map((id) => resolveSvgAssetById(appState, id)),
  };
};
