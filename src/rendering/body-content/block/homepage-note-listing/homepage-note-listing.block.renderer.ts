// src/rendering/body-content/block/homepage-note-listing/homepage-note-listing.block.renderer.ts

import type { AppRenderContextHomepageNoteListingBlock } from "@shared-types/page-content/block/homepage-note-listing/app-render-context.homepage-note-listing.block.types";

import { renderHeading } from "@rendering/shared/heading.shared.renderer";

import {
  escapeAttribute,
  escapeHtml,
} from "@rendering/utils/html.escape.util.renderer";

type HomepageNoteListingNote =
  AppRenderContextHomepageNoteListingBlock["notes"][number];

const renderNoteMeta = (note: HomepageNoteListingNote): string => {
  const items = [
    note.topic ? `<span>${escapeHtml(note.topic)}</span>` : "",
    note.publishedAt && note.publishedLabel
      ? `<time datetime="${escapeAttribute(note.publishedAt)}">${escapeHtml(note.publishedLabel)}</time>`
      : "",
  ].filter((item) => item.length > 0);

  if (items.length === 0) return "";

  return `<p class="m-homepage-note-listing__meta">${items.join(
    `<span aria-hidden="true">·</span>`,
  )}</p>`;
};

const renderHomepageNoteListingItem = (note: HomepageNoteListingNote): string =>
  [
    `<article class="m-homepage-note-listing__item">`,
    renderNoteMeta(note),
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
    renderNoteMeta(featured),
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
