// src/app/renderContext/resolvers/dimensions.svg.asset.resolve.renderContext.ts

const BASE_SIZE = 100;

export const resolveSvgDimensionsFromViewBox = (
  viewBox: string,
): { width: number; height: number } => {
  const parts = viewBox.trim().split(/\s+/);

  if (parts.length !== 4) {
    throw new Error(`Invalid SVG viewBox: ${viewBox}`);
  }

  const rawWidth = Number(parts[2]);
  const rawHeight = Number(parts[3]);

  if (!Number.isFinite(rawWidth) || !Number.isFinite(rawHeight)) {
    throw new Error(`Invalid SVG viewBox dimensions: ${viewBox}`);
  }

  if (rawWidth === 0 || rawHeight === 0) {
    throw new Error(`SVG viewBox cannot have zero dimensions: ${viewBox}`);
  }

  const ratio = rawWidth / rawHeight;

  // Normalise to a base size
  if (ratio >= 1) {
    // landscape or square
    return {
      width: BASE_SIZE,
      height: Math.round(BASE_SIZE / ratio),
    };
  }

  // portrait
  return {
    width: Math.round(BASE_SIZE * ratio),
    height: BASE_SIZE,
  };
};
