// src/app/rendering/content/modules/journalEntryFooter/journalEntryFooter.render.module.ts

import type { RenderContextJournalEntryFooterModule } from "@app/renderContext/content/modules/journalEntryFooter/journalEntryFooter.module.renderContext.types";

import {
  escapeAttribute,
  escapeHtmlContent,
} from "@app/rendering/utils/escapeContent.util";
import { formatDate } from "@app/rendering/utils/formatDate.util";

const renderPublication = (
  publication: RenderContextJournalEntryFooterModule["publication"],
): string => {
  if (publication.length === 0) {
    return "";
  }

  return `
    <section class="m-article-footer__group">
      <h3 class="m-article-footer__heading">Publication</h3>
      <dl class="m-article-footer__list">
        ${publication
          .map((item) => {
            const renderedValue =
              item.kind === "date"
                ? `<time datetime="${escapeAttribute(item.value)}">${escapeHtmlContent(
                    formatDate(item.value),
                  )}</time>`
                : escapeHtmlContent(item.value);

            return `
          <div class="m-article-footer__item">
            <dt class="m-article-footer__label">
              ${escapeHtmlContent(item.label)}
            </dt>
            <dd class="m-article-footer__value">
              ${renderedValue}
            </dd>
          </div>
        `;
          })
          .join("")}
      </dl>
    </section>
  `;
};

const renderFieldNotes = (
  fieldNotes: RenderContextJournalEntryFooterModule["fieldNotes"],
): string => {
  if (fieldNotes.length === 0) {
    return "";
  }

  return `
    <section class="m-article-footer__group">
      <h3 class="m-article-footer__heading">Field notes</h3>
      <dl class="m-article-footer__list">
        ${fieldNotes
          .map((item) => {
            const joinedValues = item.values.join(", ");

            return `
              <div class="m-article-footer__item">
                <dt class="m-article-footer__label">
                  ${escapeHtmlContent(item.label)}
                </dt>
                <dd class="m-article-footer__value" title="${escapeAttribute(
                  joinedValues,
                )}">
                  ${escapeHtmlContent(joinedValues)}
                </dd>
              </div>
            `;
          })
          .join("")}
      </dl>
    </section>
  `;
};

export const renderJournalEntryFooter = (
  module: RenderContextJournalEntryFooterModule,
): string => {
  const publication = renderPublication(module.publication);
  const fieldNotes = renderFieldNotes(module.fieldNotes);

  if (!publication && !fieldNotes) {
    return "";
  }

  return `
    <footer class="l-content m-article-footer">
      <h2 class="u-sr-only">Article footer</h2>
      ${publication}
      ${fieldNotes}
    </footer>
  `;
};
