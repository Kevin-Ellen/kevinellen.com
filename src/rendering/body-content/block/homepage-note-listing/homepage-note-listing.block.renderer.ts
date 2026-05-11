// src/rendering/body-content/block/homepage-note-listing/homepage-note-listing.block.renderer.ts

import type { AppRenderContextHomepageNoteListingBlock } from "@shared-types/page-content/block/homepage-note-listing/app-render-context.homepage-note-listing.block.types";

import { renderHeading } from "@rendering/shared/heading.shared.renderer";

import {
  escapeAttribute,
  escapeHtml,
} from "@rendering/utils/html.escape.util.renderer";

const renderHomepageNoteListingItem = (
  note: AppRenderContextHomepageNoteListingBlock["notes"][number],
): string =>
  [
    `<article class="m-homepage-note-listing__item">`,
    note.topic
      ? `<p class="m-homepage-note-listing__topic">${escapeHtml(note.topic)}</p>`
      : "",
    note.publishedLabel
      ? `<p class="m-homepage-note-listing__item-date">${escapeHtml(note.publishedLabel)}</p>`
      : "",
    `<h3 class="m-homepage-note-listing__title">`,
    `<a class="m-homepage-note-listing__link" href="${escapeAttribute(note.href)}">${escapeHtml(note.title)}</a>`,
    `</h3>`,
    note.intro
      ? `<p class="m-homepage-note-listing__intro">${escapeHtml(note.intro)}</p>`
      : "",
    `<a class="m-homepage-note-listing__item-action" href="${escapeAttribute(note.href)}">Read note</a>`,
    `</article>`,
  ].join("");

export const renderHomepageNoteListingBlock = (
  module: AppRenderContextHomepageNoteListingBlock,
): string => {
  const [featured, ...notes] = module.notes;

  if (featured === undefined) {
    return "";
  }

  return [
    `<section class="m-homepage-note-listing l-content">`,
    renderHeading(module.heading, {
      className: "m-homepage-note-listing__heading",
    }),
    `<article class="m-homepage-note-listing__featured">`,
    `<div class="m-homepage-note-listing__featured-content">`,
    featured.topic
      ? `<p class="m-homepage-note-listing__topic">${escapeHtml(featured.topic)}</p>`
      : "",
    featured.publishedLabel
      ? `<p class="m-homepage-note-listing__date">${escapeHtml(featured.publishedLabel)}</p>`
      : "",
    `<h3 class="m-homepage-note-listing__featured-title">`,
    `<a class="m-homepage-note-listing__featured-link" href="${escapeAttribute(featured.href)}">${escapeHtml(featured.title)}</a>`,
    `</h3>`,
    featured.intro
      ? `<p class="m-homepage-note-listing__featured-intro">${escapeHtml(featured.intro)}</p>`
      : "",
    `<a class="m-homepage-note-listing__action" href="${escapeAttribute(featured.href)}">Read note</a>`,
    `</div>`,
    `</article>`,
    `<div class="m-homepage-note-listing__list">`,
    notes.map(renderHomepageNoteListingItem).join(""),
    `</div>`,
    `</section>`,
  ].join("");
};
