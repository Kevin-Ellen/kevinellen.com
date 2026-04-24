// src/rendering/doc-close/doc-close.renderer.ts

import type { AppRenderContextDocClose } from "@app-render-context/types/doc-close.app-render-context.types";

import { escapeAttribute } from "@rendering/utils/html.escape.util.renderer";

const renderStructuredDataItem = (item: unknown): string => {
  return `<script type="application/ld+json">${JSON.stringify(item)}</script>`;
};

const renderInlineScript = (
  script: AppRenderContextDocClose["inlineScripts"][number],
): string => {
  const nonceAttribute = script.nonce
    ? ` nonce="${escapeAttribute(script.nonce)}"`
    : "";

  return `<script${nonceAttribute}>${script.content}</script>`;
};

const renderLinkScript = (
  script: AppRenderContextDocClose["linkScripts"][number],
): string => {
  const nonceAttribute = script.nonce
    ? ` nonce="${escapeAttribute(script.nonce)}"`
    : "";

  const loadingAttribute =
    script.loading === "blocking" ? "" : ` ${script.loading}`;

  return `<script src="${escapeAttribute(script.src)}"${nonceAttribute}${loadingAttribute}></script>`;
};

const renderSvgAsset = (
  svg: AppRenderContextDocClose["svg"][number],
): string => {
  return `<symbol id="${escapeAttribute(svg.id)}" viewBox="${escapeAttribute(svg.viewBox)}">${svg.content}</symbol>`;
};

const renderSvgSprite = (
  svgAssets: AppRenderContextDocClose["svg"],
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

  const inlineScripts = docClose.inlineScripts.map(renderInlineScript).join("");
  const linkScripts = docClose.linkScripts.map(renderLinkScript).join("");
  const svgSprite = renderSvgSprite(docClose.svg);

  return `${structuredData}${inlineScripts}${linkScripts}${svgSprite}</body></html>`;
};
