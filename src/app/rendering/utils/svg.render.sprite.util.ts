// src/app/rendering/utils/svg.render.sprite.util.ts

import type { RenderContextSvgAsset } from "@app/renderContext/renderContext.types";

import { escapeAttribute } from "@app/rendering/utils/escapeContent.util";

export const renderSvgSprite = (
  svgs: readonly RenderContextSvgAsset[],
): string => {
  if (svgs.length === 0) {
    return "";
  }

  const svgSymbols = svgs
    .map((svg) => {
      return `<symbol id="${escapeAttribute(svg.id)}" viewBox="${escapeAttribute(svg.viewBox)}" fill="currentColor">${svg.content}</symbol>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" hidden class="u-hidden-svg-sprite">${svgSymbols}</svg>`;
};
