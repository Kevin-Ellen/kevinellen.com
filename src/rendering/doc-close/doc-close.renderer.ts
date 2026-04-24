// src/rendering/doc-close/doc-close.renderer.ts

import type { AppRenderContextDocClose } from "@app-render-context/types/doc-close.app-render-context.types";

import { escapeAttribute } from "@rendering/utils/html.escape.util.renderer";

import {
  renderInlineScript,
  renderLinkScript,
  renderStructuredDataScript,
} from "@rendering/shared/script.shared.renderer";
import type { AppRenderContextSvgAsset } from "@shared-types/assets/svg/app-render-context.svg.assets.types";

const renderSvgAsset = (svg: AppRenderContextSvgAsset): string => {
  return `<symbol id="${escapeAttribute(svg.id)}" viewBox="${escapeAttribute(svg.viewBox)}">${svg.content}</symbol>`;
};

const renderSvgSprite = (
  svgAssets: readonly AppRenderContextSvgAsset[],
): string => {
  if (!svgAssets.length) {
    return "";
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" hidden class="u-hidden-svg-sprite">${svgAssets
    .map(renderSvgAsset)
    .join("")}</svg>`;
};

export const renderDocClose = (docClose: AppRenderContextDocClose): string => {
  const structuredData = docClose.structuredData
    .map(renderStructuredDataScript)
    .join("");

  const inlineScripts = docClose.inlineScripts.map(renderInlineScript).join("");
  const linkScripts = docClose.linkScripts.map(renderLinkScript).join("");
  const svgSprite = renderSvgSprite(docClose.svg);

  return `${structuredData}${inlineScripts}${linkScripts}${svgSprite}</body></html>`;
};
