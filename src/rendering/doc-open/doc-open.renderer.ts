// src/rendering/doc-open/doc-open.renderer.ts

import type { AppRenderContextDocOpen } from "@app-render-context/types/doc-open.app-render-context.types";

import CSS from "../../../.build/generated/styles.css?raw";

import {
  escapeAttribute,
  escapeHtml,
} from "@rendering/utils/html.escape.util.renderer";

import {
  renderCanonicalLink,
  renderHeadLink,
  renderPreloadLink,
} from "@rendering/doc-open/link.doc-open.renderer";

import {
  renderInlineScript,
  renderLinkScript,
} from "@rendering/shared/script.shared.renderer";

export const renderDocOpen = (docOpen: AppRenderContextDocOpen): string => {
  const headLinks = docOpen.links.map(renderHeadLink).join("");
  const preloadLinks = docOpen.preload.map(renderPreloadLink).join("");
  const linkScripts = docOpen.linkScripts.map(renderLinkScript).join("");
  const inlineScripts = docOpen.inlineScripts.map(renderInlineScript).join("");

  const pageTitle = `<title>${escapeHtml(docOpen.metadata.pageTitle)}</title>`;

  const metaDescription = `<meta name="description" content="${escapeAttribute(
    docOpen.metadata.metaDescription,
  )}">`;

  const canonical = docOpen.canonicalUrl
    ? renderCanonicalLink(docOpen.canonicalUrl)
    : "";

  return [
    `<!doctype html>`,
    `<html lang="${escapeAttribute(docOpen.language)}">`,
    `<head>`,
    `<meta charset="utf-8">`,
    `<meta name="viewport" content="width=device-width, initial-scale=1">`,
    `<style nonce="${escapeAttribute(docOpen.nonce)}">${CSS}</style>`,
    pageTitle,
    metaDescription,
    canonical,
    `<meta name="theme-color" content="${escapeAttribute(docOpen.themeColour)}">`,
    preloadLinks,
    headLinks,
    linkScripts,
    inlineScripts,
    `</head>`,
    `<body>`,
  ].join("");
};
