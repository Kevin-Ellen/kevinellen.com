// src/rendering/doc-open/doc-open.renderer.ts

import type { AppRenderContextDocOpen } from "@app-render-context/types/doc-open.app-render-context.types";

import {
  escapeAttribute,
  escapeHtml,
} from "@rendering/utils/html.escape.util.renderer";

const renderHeadLink = (
  link: AppRenderContextDocOpen["assets"]["links"][number],
): string => {
  const attributes = [
    `rel="${escapeAttribute(link.rel)}"`,
    `href="${escapeAttribute(link.href)}"`,
    "type" in link && link.type ? `type="${escapeAttribute(link.type)}"` : "",
    "sizes" in link && link.sizes
      ? `sizes="${escapeAttribute(link.sizes)}"`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `<link ${attributes}>`;
};

export const renderDocOpen = (docOpen: AppRenderContextDocOpen): string => {
  const headLinks = docOpen.assets.links.map(renderHeadLink).join("");

  const pageTitle = docOpen.metadata?.pageTitle
    ? `<title>${escapeHtml(docOpen.metadata.pageTitle)}</title>`
    : "";

  const metaDescription = docOpen.metadata?.metaDescription
    ? `<meta name="description" content="${escapeAttribute(docOpen.metadata.metaDescription)}">`
    : "";

  const canonical = docOpen.canonicalUrl
    ? `<link rel="canonical" href="${escapeAttribute(docOpen.canonicalUrl)}">`
    : "";

  return `<!doctype html>
<html lang="${escapeAttribute(docOpen.language)}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${pageTitle}
    ${metaDescription}
    ${canonical}
    <meta name="theme-color" content="${escapeAttribute(docOpen.themeColour)}">
    ${headLinks}
  </head>
  <body>`;
};
