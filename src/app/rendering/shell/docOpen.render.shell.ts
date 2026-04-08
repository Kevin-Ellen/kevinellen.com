// src/app/rendering/shell/docOpen.render.shell.ts

import css from "../../../../.build/generated/styles.css?raw";

import type { RenderContext } from "@app/renderContext/class.renderContext";

import { renderScriptAsset } from "@app/rendering/utils/script.render.util";
import {
  escapeAttribute,
  escapeHtmlContent,
} from "@app/rendering/utils/escapeContent.util";

const renderHeadIcons = (ctx: RenderContext): string[] => {
  const fragments = [
    `<link rel="icon" href="${escapeAttribute(ctx.head.icons.faviconIco.href)}">`,
    `<link rel="apple-touch-icon" href="${escapeAttribute(ctx.head.icons.appleTouchIcon.href)}">`,
    `<link rel="manifest" href="${escapeAttribute(ctx.head.icons.manifest.href)}">`,
  ];

  if (ctx.head.icons.faviconSvg) {
    fragments.push(
      `<link rel="icon" type="${escapeAttribute(ctx.head.icons.faviconSvg.type)}" href="${escapeAttribute(ctx.head.icons.faviconSvg.href)}">`,
    );
  }

  if (ctx.head.icons.faviconPng) {
    fragments.push(
      `<link rel="icon" type="${escapeAttribute(ctx.head.icons.faviconPng.type)}" sizes="${escapeAttribute(ctx.head.icons.faviconPng.sizes)}" href="${escapeAttribute(ctx.head.icons.faviconPng.href)}">`,
    );
  }

  return fragments;
};

export const docOpenRenderShell = (ctx: RenderContext): string => {
  const headFragments = [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<style nonce="${escapeAttribute(ctx.security.nonce)}">${css}</style>`,
    `<title>${escapeHtmlContent(ctx.metadata.title)}</title>`,
    `<meta name="description" content="${escapeAttribute(ctx.metadata.description)}">`,
    ctx.metadata.canonicalUrl
      ? `<link rel="canonical" href="${escapeAttribute(ctx.metadata.canonicalUrl)}">`
      : "",
    ...renderHeadIcons(ctx),
    ...ctx.head.scripts.map((script) =>
      renderScriptAsset(script, ctx.security.nonce),
    ),
  ].filter((fragment) => fragment.length > 0);

  return `<!doctype html>
<html lang="${escapeAttribute(ctx.document.language)}">
  <head>
    ${headFragments.join("\n    ")}
  </head>
  <body class="l-page">`;
};
