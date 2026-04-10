// src/app/renderContext/resolvers/reference.svg.asset.resolve.renderContext.ts

import type { SvgAssetAuthored } from "@shared-types/assets/svg.asset.authored.types";
import type { RenderContextSvgReference } from "@app/renderContext/renderContext.types";

import { resolveSvgDimensionsFromViewBox } from "@app/renderContext/resolvers/dimensions.svg.asset.resolve.renderContext";

export const resolveSvgReference = (
  svgs: readonly SvgAssetAuthored[],
  id: string,
): RenderContextSvgReference => {
  const svg = svgs.find((item) => item.id === id);

  if (!svg) {
    throw new Error(`SVG asset not found for id: ${id}`);
  }

  const { width, height } = resolveSvgDimensionsFromViewBox(svg.viewBox);

  return {
    id: svg.id,
    width,
    height,
  };
};
