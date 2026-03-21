// src/app/rendering/renderer/utils/renderSvg.util.renderer.ts

import type { RenderSvgIconOptions } from "@app/rendering/renderers.types";

import { escapeAttribute } from "@app/rendering/renderer/utils/escapeAttribute.util.renderer";

export const renderSvgIcon = (
  iconId: string,
  options: RenderSvgIconOptions = {},
): string => {
  const {
    className = "c-icon",
    width = "1",
    height = "1",
    ariaHidden = true,
  } = options;

  const ariaHiddenAttribute = ariaHidden ? ' aria-hidden="true"' : "";

  return `<svg class="${escapeAttribute(className)}"${ariaHiddenAttribute} width="${escapeAttribute(width)}" height="${escapeAttribute(height)}">
    <use href="#${escapeAttribute(iconId)}"></use>
  </svg>`;
};
