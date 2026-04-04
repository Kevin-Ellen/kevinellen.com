// src/app/rendering/utils/svg.render.util.ts

import type { SvgAssetConfig } from "@config/assets.config.types";

import { escapeAttribute } from "@utils/escapeContent.util";

export const renderSvgSprite = (svgs: readonly SvgAssetConfig[]): string => {
  if (svgs.length === 0) {
    return "";
  }

  const svgSymbols = svgs
    .map((svg) => {
      return `<symbol id="${escapeAttribute(svg.id)}" viewBox="${escapeAttribute(svg.viewBox)}" fill="currentColor">${svg.content}</symbol>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display: none;">${svgSymbols}</svg>`;
};
