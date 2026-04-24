// src/app-render-context/utils/normaliseDimensions.util.ts

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
