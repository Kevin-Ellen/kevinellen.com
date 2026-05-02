// src/rendering/body-content/block/journal-listing.body-content.renderer.ts

import type { AppRenderContextJournalListingBlockContentModule } from "@shared-types/page-content/block/journal-listing/app-render-context.journal-listing.block.page-content.types";

import { escapeHtml } from "@rendering/utils/html.escape.util.renderer";
import { renderPagination } from "@rendering/shared/pagination.shared.renderer";

const renderJournalListingItem = (
  item: AppRenderContextJournalListingBlockContentModule["items"][number],
  index: number,
  currentPage: number,
): string => {
  const isFeatured = index === 0 && currentPage === 1;

  const itemClass = isFeatured
    ? "m-journal-listing__item m-journal-listing__item--featured"
    : "m-journal-listing__item";

  return `<li class="${itemClass}">
    <a class="m-journal-listing__link" href="${escapeHtml(item.href)}">
      ${
        item.image
          ? `<div class="m-journal-listing__media">
              <img
                src="${escapeHtml(item.image.src)}"
                srcset="${escapeHtml(item.image.srcset.join(", "))}"
                sizes="${escapeHtml(item.image.sizes)}"
                alt="${escapeHtml(item.image.alt)}"
                width="${item.image.ratio.width}"
                height="${item.image.ratio.height}"
                loading="lazy"
              />
            </div>`
          : ""
      }

      <div class="m-journal-listing__content m-heading">
        ${
          item.publishedLabel
            ? `<time class="m-heading__eyebrow" datetime="${escapeHtml(item.publishedAt ?? "")}">${escapeHtml(item.publishedLabel)}</time>`
            : ""
        }

        <h3 class="m-heading__title">${escapeHtml(item.title)}</h3>

        ${
          isFeatured && item.intro
            ? `<p class="m-heading__intro">${escapeHtml(item.intro)}</p>`
            : ""
        }
      </div>
    </a>
  </li>`;
};

export const renderJournalListingBlockContentModule = (
  module: AppRenderContextJournalListingBlockContentModule,
): string => {
  const items = module.items
    .map((item, index) =>
      renderJournalListingItem(item, index, module.pagination.currentPage),
    )
    .join("");

  return `<section class="m-contentBlock m-journal-listing" aria-label="Journal listing">
    <ul class="m-journal-listing__list">
      ${items}
    </ul>
    ${renderPagination(module.pagination, "Journal pagination")}
  </section>`;
};
