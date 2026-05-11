// src/rendering/body-content/block/journal-listing/journal-listing.block.renderer.ts

import type {
  AppRenderContextJournalListingBlock,
  AppRenderContextJournalListingItem,
} from "@shared-types/page-content/block/journal-listing/app-render-context.journal-listing.block.types";

import { renderPagination } from "@rendering/shared/pagination.shared.renderer";

import {
  escapeAttribute,
  escapeHtml,
} from "@rendering/utils/html.escape.util.renderer";

const renderJournalListingImage = (
  image: NonNullable<AppRenderContextJournalListingItem["image"]>,
): string =>
  [
    `<div class="m-journal-listing__media">`,
    `<img`,
    ` src="${escapeAttribute(image.src)}"`,
    ` srcset="${escapeAttribute(image.srcset.join(", "))}"`,
    ` sizes="${escapeAttribute(image.sizes)}"`,
    ` alt="${escapeAttribute(image.alt)}"`,
    ` width="${image.width}"`,
    ` height="${image.height}"`,
    ` loading="lazy"`,
    `>`,
    `</div>`,
  ].join("");

const renderJournalListingItem = (
  item: AppRenderContextJournalListingItem,
  index: number,
  currentPage: number,
): string => {
  const isFeatured = index === 0 && currentPage === 1;

  const itemClass = isFeatured
    ? "m-journal-listing__item m-journal-listing__item--featured"
    : "m-journal-listing__item";

  return [
    `<li class="${itemClass}">`,
    `<a class="m-journal-listing__link" href="${escapeAttribute(item.href)}">`,
    item.image ? renderJournalListingImage(item.image) : "",
    `<div class="m-journal-listing__content m-heading">`,
    item.publishedLabel
      ? `<time class="m-heading__eyebrow" datetime="${escapeAttribute(item.publishedAt ?? "")}">${escapeHtml(item.publishedLabel)}</time>`
      : "",
    `<h3 class="m-heading__title">${escapeHtml(item.title)}</h3>`,
    isFeatured && item.intro
      ? `<p class="m-heading__intro">${escapeHtml(item.intro)}</p>`
      : "",
    `</div>`,
    `</a>`,
    `</li>`,
  ].join("");
};

export const renderJournalListingBlock = (
  module: AppRenderContextJournalListingBlock,
): string => {
  const items = module.items
    .map((item, index) =>
      renderJournalListingItem(item, index, module.pagination.currentPage),
    )
    .join("");

  return [
    `<section class="m-contentBlock m-journal-listing" aria-label="Journal listing">`,
    `<ul class="m-journal-listing__list">`,
    items,
    `</ul>`,
    renderPagination(module.pagination, "Journal pagination"),
    `</section>`,
  ].join("");
};
