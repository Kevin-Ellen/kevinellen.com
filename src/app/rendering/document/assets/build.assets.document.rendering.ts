// src/app/rendering/document/assets/build.assets.document.rendering.ts

import type { AppState } from "@app/appState/appState";
import type { PageDefinition } from "@app/pages/page.definition";
import type { DocumentRenderAssets } from "@app/rendering/document/document.render.types";

export const buildAssets = (
  appState: AppState,
  page: PageDefinition,
): DocumentRenderAssets => {
  return {
    scripts: mergeByKey(
      appState.appAssets.scripts,
      page.docFooter.scripts,
      (script) => script.id,
    ),
    svgs: mergeByKey(
      appState.appAssets.svgs,
      page.docFooter.svgs,
      (svg) => svg.id,
    ),
  };
};

const mergeByKey = <T>(
  globalAssets: readonly T[],
  pageAssets: readonly T[],
  getKey: (item: T) => string,
): readonly T[] => {
  const merged = [...globalAssets, ...pageAssets];
  const seen = new Set<string>();

  return merged.filter((item) => {
    const key = getKey(item);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};
