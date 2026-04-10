// src/app/renderContext/resolvers/dimensions.svg.asset.resolve.renderContext.ts

import { normaliseDimensionsToBase } from "@utils/normaliseDimensions.util";

export const resolveSvgDimensionsFromViewBox = (
  viewBox: string,
): { width: number; height: number } => {
  const parts = viewBox.trim().split(/\s+/);

  if (parts.length !== 4) {
    throw new Error(`Invalid SVG viewBox: ${viewBox}`);
  }

  const rawWidth = Number(parts[2]);
  const rawHeight = Number(parts[3]);

  return normaliseDimensionsToBase(rawWidth, rawHeight, 100);
};
