// src/app/rendering/document/shell/documentStart.render.shell.ts

import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

import css from "../../../../../.build/generated/styles.css?raw";

import { escapeAttribute, escapeHtmlContent } from "@utils/escapeContent.util";
import { renderScriptAsset } from "@app/rendering/utils/script.render.util";

export const renderDocOpen = (
  documentRenderContext: DocumentRenderContext,
): string => {
  const { site, metadata, security, assets } = documentRenderContext;

  const headFragments = [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<style nonce="${escapeAttribute(security.nonce)}">${css}</style>`,
    `<title>${escapeHtmlContent(metadata.pageTitle)}</title>`,
    `<meta name="description" content="${escapeAttribute(metadata.metaDescription)}">`,
    metadata.canonicalUrl
      ? `<link rel="canonical" href="${escapeAttribute(metadata.canonicalUrl)}">`
      : "",
    ...assets.header.scripts.map((script) =>
      renderScriptAsset(script, security.nonce),
    ),
  ].filter((fragment) => fragment.length > 0);

  return `<!doctype html>
<html lang="${escapeAttribute(site.language)}">
  <head>
    ${headFragments.join("\n    ")}
  </head>
  <body class="l-page">`;
};
