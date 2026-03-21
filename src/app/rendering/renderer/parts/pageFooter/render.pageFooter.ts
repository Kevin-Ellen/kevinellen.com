// src/app/rendering/renderer/parts/pageFooter/render.pageFooter.ts

import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

import { escapeAttribute } from "@app/rendering/renderer/utils/escapeAttribute.util.renderer";
import { escapeHtml } from "@app/rendering/renderer/utils/escapeHtml.util.renderer";

export const renderPageFooter = (ctx: DocumentRenderContext): string => {
  const sections = ctx.pageFooter.navigation.sections
    .map((section) => {
      const items = section.items
        .map((item) => {
          return `<li class="l-footer__item">
            <a class="l-footer__link" href="${escapeAttribute(item.href)}">${escapeHtml(item.label)}</a>
          </li>`;
        })
        .join("");

      return `<section class="l-footer__group l-footer__group--${escapeAttribute(section.id)}">
        <h2 class="l-footer__heading">${escapeHtml(section.label)}</h2>
        <ul class="l-footer__list">
          ${items}
        </ul>
      </section>`;
    })
    .join("");

  return `<footer class="l-footer">
    <div class="l-page__frame">
      ${sections}
    </div>
  </footer>`;
};
