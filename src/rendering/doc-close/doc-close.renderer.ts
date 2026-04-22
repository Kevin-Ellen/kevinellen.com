// src/rendering/doc-close/doc-close.renderer.ts

import type { AppRenderContextDocClose } from "@app-render-context/types/doc-close.app-render-context.types";

import { escapeAttribute } from "@rendering/utils/html.escape.util.renderer";

const renderStructuredDataItem = (item: unknown): string => {
  return `<script type="application/ld+json">${JSON.stringify(item)}</script>`;
};

const renderScriptAsset = (
  script: AppRenderContextDocClose["assets"]["scripts"][number],
): string => {
  if (script.kind === "inline") {
    const nonceAttribute = script.nonce
      ? ` nonce="${escapeAttribute(script.nonce)}"`
      : "";

    return `<script${nonceAttribute}>${script.content}</script>`;
  }

  return "";
};

const renderSvgAsset = (
  svg: AppRenderContextDocClose["assets"]["svg"][number],
): string => {
  return `<symbol id="${escapeAttribute(svg.id)}" viewBox="${escapeAttribute(svg.viewBox)}">${svg.content}</symbol>`;
};

const renderSvgSprite = (
  svgAssets: AppRenderContextDocClose["assets"]["svg"],
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
    .map(renderStructuredDataItem)
    .join("");

  const scripts = docClose.assets.scripts.map(renderScriptAsset).join("");

  const svgSprite = renderSvgSprite(docClose.assets.svg);

  return `${structuredData}${scripts}${svgSprite}</body></html>`;
};
