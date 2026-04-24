// src/rendering/shared/svg-reference.shared.renderer.ts

import type { AppRenderContextSvgReference } from "@shared-types/assets/svg/app-render-context.svg.assets.types";

import { escapeAttribute } from "@rendering/utils/html.escape.util.renderer";

export const renderSvgReference = (
  svg: AppRenderContextSvgReference,
  className: string,
): string =>
  `<svg class="${escapeAttribute(className)}" aria-hidden="true" width="${svg.width}" height="${svg.height}">
    <use href="#${escapeAttribute(svg.id)}"></use>
  </svg>`;
