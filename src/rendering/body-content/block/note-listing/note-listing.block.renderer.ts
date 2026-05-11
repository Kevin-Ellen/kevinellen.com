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

const renderNoteListingMeta = (
  item: AppRenderContextNoteListingItem,
): string => {
  const meta = [
    item.topic ? `<span>${escapeHtml(item.topic)}</span>` : "",
    item.publishedLabel
      ? `<time datetime="${escapeAttribute(item.publishedAt ?? "")}">${escapeHtml(item.publishedLabel)}</time>`
      : "",
  ].filter((value) => value.length > 0);

  if (meta.length === 0) return "";

  return `<p class="m-heading__eyebrow m-note-listing__meta">${meta.join(
    `<span aria-hidden="true">·</span>`,
  )}</p>`;
};

const renderNoteListingItem = (
  item: AppRenderContextNoteListingItem,
  index: number,
  currentPage: number,
): string => {
  const isFeatured = index === 0 && currentPage === 1;

  const itemClass = isFeatured
    ? "m-note-listing__item m-note-listing__item--featured l-content"
    : "m-note-listing__item l-content";

  return [
    `<li class="${itemClass}">`,
    `<a class="m-note-listing__link" href="${escapeAttribute(item.href)}">`,
    `<div class="m-note-listing__content m-heading">`,
    renderNoteListingMeta(item),
    `<h3 class="m-heading__title">${escapeHtml(item.title)}</h3>`,
    item.intro
      ? `<p class="m-heading__intro">${escapeHtml(item.intro)}</p>`
      : "",
    `</div>`,
    `</a>`,
    `</li>`,
  ].join("");
};

export const renderNoteListingBlock = (
  module: AppRenderContextNoteListingBlock,
): string => {
  const items = module.items
    .map((item, index) =>
      renderNoteListingItem(item, index, module.pagination.currentPage),
    )
    .join("");

  return [
    `<section class="m-contentBlock m-note-listing" aria-label="Notes listing">`,
    `<ul class="m-note-listing__list">`,
    items,
    `</ul>`,
    renderPagination(module.pagination, "Notes pagination"),
    `</section>`,
  ].join("");
};
