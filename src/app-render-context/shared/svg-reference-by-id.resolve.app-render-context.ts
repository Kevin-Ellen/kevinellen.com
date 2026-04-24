// src/app-render-context/shared/svg-reference-by-id.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { SvgAssetId } from "@shared-types/assets/svg/id.svg.assets.types";
import type { AppRenderContextSvgReference } from "@shared-types/assets/svg/app-render-context.svg.assets.types";

import { resolveSvgReferencesAppRenderContext } from "@app-render-context/shared/svg.resolve.app-render-context";

export const resolveSvgReferenceByIdAppRenderContext = (
  appContext: AppContext,
  svgId: SvgAssetId | null,
): AppRenderContextSvgReference | null => {
  if (!svgId) {
    return null;
  }

  const svg = resolveSvgReferencesAppRenderContext(appContext).find(
    (item) => item.id === svgId,
  );

  if (!svg) {
    throw new Error(`Missing SVG asset: ${svgId}`);
  }

  return svg;
};
