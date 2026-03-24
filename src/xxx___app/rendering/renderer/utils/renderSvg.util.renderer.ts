// src/app/rendering/renderer/utils/renderSvg.util.renderer.ts

import type { SvgAsset } from "@app/assets/svgs/svgs.assets.types";
import type {
  RenderSvgOptions,
  SvgDimensions,
  ResolvedSvgDimensions,
} from "@app/rendering/renderers.types";

import { escapeAttribute } from "@app/rendering/renderer/utils/escapeAttribute.util.renderer";

const parseViewBoxDimensions = (viewBox: string): SvgDimensions | null => {
  const parts = viewBox.trim().split(/\s+/).map(Number);

  if (parts.length !== 4 || parts.some((value) => Number.isNaN(value))) {
    return null;
  }

  const [, , width, height] = parts;

  if (
    width === undefined ||
    height === undefined ||
    width <= 0 ||
    height <= 0
  ) {
    return null;
  }

  return { width, height };
};

const resolveSvgDimensions = (asset: SvgAsset): ResolvedSvgDimensions => {
  const intrinsicDimensions = parseViewBoxDimensions(asset.viewBox);

  if (!intrinsicDimensions) {
    return null;
  }

  return {
    width: String(intrinsicDimensions.width),
    height: String(intrinsicDimensions.height),
  };
};

export const renderSvg = (
  asset: SvgAsset,
  options: RenderSvgOptions = {},
): string => {
  const {
    className = "c-icon",
    ariaHidden = true,
    ariaLabel,
    focusable = "false",
  } = options;

  const resolvedDimensions = resolveSvgDimensions(asset);

  const accessibilityAttributes = ariaHidden
    ? ' aria-hidden="true"'
    : ariaLabel
      ? ` role="img" aria-label="${escapeAttribute(ariaLabel)}"`
      : "";

  const widthAttribute = resolvedDimensions
    ? ` width="${escapeAttribute(resolvedDimensions.width)}"`
    : "";

  const heightAttribute = resolvedDimensions
    ? ` height="${escapeAttribute(resolvedDimensions.height)}"`
    : "";

  return `<svg class="${escapeAttribute(className)}"${accessibilityAttributes}${widthAttribute}${heightAttribute} viewBox="${escapeAttribute(asset.viewBox)}" focusable="${escapeAttribute(focusable)}"><use href="#${escapeAttribute(asset.id)}"></use></svg>`;
};
