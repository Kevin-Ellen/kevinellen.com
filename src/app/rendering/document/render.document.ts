// src/app/rendering/document/render.document.ts

import type {
  ContentInline,
  ContentParagraph,
} from "@app/content/content.types";
import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

import { escapeHtmlContent, escapeAttribute } from "@utils/escapeContent.util";

import { renderDocOpen } from "@app/rendering/document/shell/docOpen.render.shell";
import { renderPageHeader } from "@app/rendering/document/shell/pageHeader.render.shell";
import { renderPageFooter } from "@app/rendering/document/shell/pageFooter.render.shell";
import { renderDocClose } from "@app/rendering/document/shell/docClose.render.shell";

const renderInline = (inline: ContentInline): string => {
  switch (inline.kind) {
    case "text":
      return escapeHtmlContent(inline.text);

    case "internal-link":
      return `<a href="${escapeAttribute(inline.href)}">${escapeHtmlContent(inline.label)}</a>`;

    case "external-link":
      return `<a href="${escapeAttribute(inline.href)}">${escapeHtmlContent(inline.label)}</a>`;
  }
};

const renderParagraph = (paragraph: ContentParagraph): string => {
  const content = paragraph.inlines
    .map((inline) => renderInline(inline))
    .join("");

  return `<p>${content}</p>`;
};

export const renderDocument = (
  documentRenderContext: DocumentRenderContext,
): string => {
  const { content } = documentRenderContext;

  const bodyHtml = content.body
    .map((paragraph) => renderParagraph(paragraph))
    .join("");

  const footerHtml = content.footer
    .map((entry) => `<p>${escapeHtmlContent(entry)}</p>`)
    .join("");

  return [
    renderDocOpen(documentRenderContext),

    renderPageHeader(documentRenderContext),
    "<main>",
    `<section><p>${escapeHtmlContent(content.head.eyebrow)}</p><h1>${escapeHtmlContent(content.head.title)}</h1><p>${escapeHtmlContent(content.head.intro)}</p></section>`,
    bodyHtml,
    footerHtml,
    "</main>",

    renderPageFooter(documentRenderContext),
    renderDocClose(documentRenderContext),
  ].join("");
};
