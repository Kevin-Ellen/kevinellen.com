// src/rendering/body-content/block/note-listing/note-listing.block.renderer.ts

import type {
  AppRenderContextNoteListingBlock,
  AppRenderContextNoteListingItem,
} from "@shared-types/page-content/block/note-listing/app-render-context.note-listing.block.types";

import { renderPagination } from "@rendering/shared/pagination.shared.renderer";

import {
  escapeAttribute,
  escapeHtml,
} from "@rendering/utils/html.escape.util.renderer";

const renderNoteListingItem = (item: AppRenderContextNoteListingItem): string =>
  [
    `<li class="m-note-listing__item">`,
    `<a class="m-note-listing__link" href="${escapeAttribute(item.href)}">`,
    `<div class="m-note-listing__content m-heading">`,
    item.topic
      ? `<p class="m-heading__eyebrow">${escapeHtml(item.topic)}</p>`
      : "",
    `<h3 class="m-heading__title">${escapeHtml(item.title)}</h3>`,
    item.intro
      ? `<p class="m-heading__intro">${escapeHtml(item.intro)}</p>`
      : "",
    item.publishedLabel
      ? `<time class="m-note-listing__date" datetime="${escapeAttribute(item.publishedAt ?? "")}">${escapeHtml(item.publishedLabel)}</time>`
      : "",
    `</div>`,
    `</a>`,
    `</li>`,
  ].join("");

export const renderNoteListingBlock = (
  module: AppRenderContextNoteListingBlock,
): string => {
  const items = module.items.map(renderNoteListingItem).join("");

  return [
    `<section class="m-contentBlock m-note-listing" aria-label="Notes listing">`,
    `<ul class="m-note-listing__list">`,
    items,
    `</ul>`,
    renderPagination(module.pagination, "Notes pagination"),
    `</section>`,
  ].join("");
};
