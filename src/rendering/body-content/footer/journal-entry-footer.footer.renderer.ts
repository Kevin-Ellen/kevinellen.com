// src/rendering/body-content/footer/journal-entry-footer.footer.renderer.ts

import type { AppRenderContextJournalEntryFooter } from "@shared-types/page-content/footer/journal-entry-footer/app-render-context.journal-entry-footer.types";

import { escapeHtml } from "@rendering/utils/html.escape.util.renderer";

const renderDefinitionItem = (label: string, value: string): string =>
  [
    `<div class="m-article-footer__item">`,
    `<dt class="m-article-footer__label">${escapeHtml(label)}</dt>`,
    `<dd class="m-article-footer__value">${escapeHtml(value)}</dd>`,
    `</div>`,
  ].join("");

const renderJournalEntryFooterEquipment = (
  label: string,
  values: readonly string[],
): string => {
  if (values.length === 0) {
    return "";
  }

  return renderDefinitionItem(label, values.join(", "));
};

export const renderJournalEntryFooter = (
  module: AppRenderContextJournalEntryFooter,
): string => {
  return [
    `<section class="m-article-footer__group">`,
    `<h3 class="m-article-footer__heading">Publication</h3>`,
    `<dl class="m-article-footer__list">`,
    renderDefinitionItem("Written by", module.publication.author),
    renderDefinitionItem("Published", module.publication.publishedAt),
    renderDefinitionItem("Last updated", module.publication.updatedAt),
    `</dl>`,
    `</section>`,
    `<section class="m-article-footer__group">`,
    `<h3 class="m-article-footer__heading">Field notes</h3>`,
    `<dl class="m-article-footer__list">`,
    renderJournalEntryFooterEquipment("Camera", module.equipment.cameras),
    renderJournalEntryFooterEquipment("Lens", module.equipment.lenses),
    `</dl>`,
    `</section>`,
  ].join("");
};
