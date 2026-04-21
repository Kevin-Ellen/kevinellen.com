// src/app-render-context/resolve/shared/svg.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppRenderContextSvgAsset } from "@shared-types/assets/svg/app-render-context.svg.assets.types";

import { normaliseDimensionsToBase } from "@utils/normaliseDimensions.util";

const parseViewBox = (viewBox: string): { width: number; height: number } => {
  const parts = viewBox.trim().split(/\s+/).map(Number);

  if (parts.length !== 4 || parts.some(Number.isNaN)) {
    throw new Error(`Invalid SVG viewBox: "${viewBox}"`);
  }

  const [, , width, height] = parts;

  if (width <= 0 || height <= 0) {
    throw new Error(`Invalid SVG dimensions in viewBox: "${viewBox}"`);
  }

  return { width, height };
};

export const resolveSvgAppRenderContext = (
  appContext: AppContext,
): readonly AppRenderContextSvgAsset[] => {
  return appContext.assets.svg.map((svg) => {
    const { width, height } = parseViewBox(svg.viewBox);

    const calculated = normaliseDimensionsToBase(width, height, 100);

    return {
      id: svg.id,
      viewBox: svg.viewBox,
      dimensions: {
        calculated,
      },
      content: svg.content,
    };
  });
};
