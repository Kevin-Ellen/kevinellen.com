// src/app/rendering/renderer/parts/docHead/render.docHead.ts

import css from "../../../../../../.build/generated/styles.css?raw";

import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

import { escapeAttribute } from "@app/rendering/renderer/utils/escapeAttribute.util.renderer";
import { escapeHtml } from "@app/rendering/renderer/utils/escapeHtml.util.renderer";
import { renderScriptAsset } from "@app/rendering/renderer/utils/script.util.renderer";

const shouldRenderCanonical = (ctx: DocumentRenderContext): boolean => {
  return ctx.page.kind !== "error";
};

const renderHeadScripts = (ctx: DocumentRenderContext): string => {
  return ctx.assets.scripts
    .filter((script) => script.location === "head")
    .map((script) => renderScriptAsset(script, ctx))
    .join("\n");
};

export const renderDocHead = (ctx: DocumentRenderContext): string => {
  const html = `<!doctype html>
<html lang="${escapeAttribute(ctx.site.language)}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style nonce="${escapeAttribute(ctx.security.nonce)}">${css}</style>
    ${
      shouldRenderCanonical(ctx)
        ? `<link rel="canonical" href="${escapeAttribute(ctx.seo.canonicalUrl)}">`
        : ""
    }
    <title>${escapeHtml(ctx.seo.pageTitle)}</title>
    <meta name="description" content="${escapeAttribute(ctx.seo.metaDescription)}">
    ${renderHeadScripts(ctx)}
  </head>
  <body class="l-page">`;

  return html;
};
