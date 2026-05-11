// src/rendering/body-content/footer/note-entry-footer/note-entry-footer.footer.renderer.ts

import type { AppRenderContextNoteEntryFooter } from "@shared-types/page-content/footer/note-entry-footer/app-render-context.note-entry-footer.types";

import { escapeHtml } from "@rendering/utils/html.escape.util.renderer";

const renderDefinitionItem = (label: string, value: string): string =>
  [
    `<div class="m-article-footer__item">`,
    `<dt class="m-article-footer__label">${escapeHtml(label)}</dt>`,
    `<dd class="m-article-footer__value">${escapeHtml(value)}</dd>`,
    `</div>`,
  ].join("");

export const renderNoteEntryFooter = (
  module: AppRenderContextNoteEntryFooter,
): string =>
  [
    `<section class="m-article-footer__group">`,
    `<h3 class="m-article-footer__heading">Publication</h3>`,
    `<dl class="m-article-footer__list">`,
    renderDefinitionItem("Written by", module.publication.author),
    renderDefinitionItem("Published", module.publication.publishedAt),
    renderDefinitionItem("Last updated", module.publication.updatedAt),
    `</dl>`,
    `</section>`,
    `<section class="m-article-footer__group">`,
    `<h3 class="m-article-footer__heading">Note details</h3>`,
    `<dl class="m-article-footer__list">`,
    renderDefinitionItem("Topic", module.topic),
    `</dl>`,
    `</section>`,
  ].join("");
