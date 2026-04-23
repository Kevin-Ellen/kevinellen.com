// src/app-render-context/resolve/shared/svg.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type {
  AppRenderContextSvgAsset,
  AppRenderContextSvgReference,
} from "@shared-types/assets/svg/app-render-context.svg.assets.types";

import { resolveSvgReferenceDimensions } from "@utils/normaliseDimensions.util";

export const resolveSvgReferencesAppRenderContext = (
  appContext: AppContext,
): readonly AppRenderContextSvgReference[] => {
  return appContext.assets.svg.map((svg) => ({
    id: svg.id,
    ...resolveSvgReferenceDimensions(svg.viewBox),
  }));
};

export const resolveSvgSpritesAppRenderContext = (
  appContext: AppContext,
): readonly AppRenderContextSvgAsset[] => {
  return appContext.assets.svg.map((svg) => ({
    id: svg.id,
    viewBox: svg.viewBox,
    content: svg.content,
  }));
};
