// src/rendering/body-content/footer/journal-entry-footer.body-content.renderer.ts

import type { AppRenderContextJournalEntryFooterModule } from "@shared-types/page-content/footer/journal-entry-footer/app-render-context.journal-entry-footer.page-content.types";

import { escapeHtml } from "@rendering/utils/html.escape.util.renderer";

const renderDefinitionItem = (
  label: string,
  value: string,
): string => `<div class="m-article-footer__item">
  <dt class="m-article-footer__label">${escapeHtml(label)}</dt>
  <dd class="m-article-footer__value">${escapeHtml(value)}</dd>
</div>`;

export const renderJournalEntryFooterModule = (
  module: AppRenderContextJournalEntryFooterModule,
): string => {
  const lastUpdated =
    module.publication.updatedAt[module.publication.updatedAt.length - 1] ??
    module.publication.publishedAt;

  const cameras = module.equipment.cameras.join(", ");
  const lenses = module.equipment.lenses.join(", ");

  // const tags = module.tags
  //   .map(
  //     (tag) =>
  //       `<li><a href="/journal/tags/${escapeHtml(tag)}">${escapeHtml(tag)}</a></li>`,
  //   )
  //   .join("");

  return `<section class="m-article-footer__group">
    <h3 class="m-article-footer__heading">Publication</h3>
    <dl class="m-article-footer__list">
      ${renderDefinitionItem("Written by", module.publication.author)}
      ${renderDefinitionItem("Published", module.publication.publishedAt)}
      ${renderDefinitionItem("Last updated", lastUpdated)}
    </dl>
  </section>

  <section class="m-article-footer__group">
    <h3 class="m-article-footer__heading">Field notes</h3>
    <dl class="m-article-footer__list">
      ${cameras ? renderDefinitionItem("Camera", cameras) : ""}
      ${lenses ? renderDefinitionItem("Lens", lenses) : ""}
    </dl>
  </section>`;
};

/* <section class="m-article-footer__group">
    <h3 class="m-article-footer__heading">Tags</h3>
    <ul class="m-article-footer__tags">
      ${tags}
    </ul>
  </section>`;

  */
