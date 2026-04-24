// src/utils/normaliseDimensions.util.ts

export const normaliseDimensionsToBase = (
  width: number,
  height: number,
  baseSize: number = 100,
): { width: number; height: number } => {
  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    throw new Error("Dimensions must be finite numbers.");
  }

  if (width <= 0 || height <= 0) {
    throw new Error("Dimensions must be greater than zero.");
  }

  const ratio = width / height;

  if (ratio >= 1) {
    return {
      width: baseSize,
      height: Math.round(baseSize / ratio),
    };
  }

  return {
    width: Math.round(baseSize * ratio),
    height: baseSize,
  };
};

export const resolveSvgReferenceDimensions = (
  viewBox: string,
  baseSize: number = 100,
): { width: number; height: number } => {
  const { width, height } = parseSvgViewBoxDimensions(viewBox);

  return normaliseDimensionsToBase(width, height, baseSize);
};

const parseSvgViewBoxDimensions = (
  viewBox: string,
): { width: number; height: number } => {
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
