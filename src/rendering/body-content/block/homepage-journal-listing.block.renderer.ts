// src/rendering/body-content/block/homepage-journal-listing.block.renderer.ts

import type { AppRenderContextHomepageJournalListingBlock } from "@shared-types/page-content/block/homepage-journal-listing/app-render-context.homepage-journal-listing.block.types";

import { renderHeading } from "@rendering/shared/heading.shared.renderer";

import {
  escapeAttribute,
  escapeHtml,
} from "@rendering/utils/html.escape.util.renderer";

const renderHomepageJournalListingImage = (
  image: AppRenderContextHomepageJournalListingBlock["entries"][number]["image"],
): string => {
  if (image === null) {
    return "";
  }

  return [
    `<img`,
    ` class="m-homepage-journal-listing__image"`,
    ` src="${escapeAttribute(image.src)}"`,
    ` srcset="${escapeAttribute(image.srcset.join(", "))}"`,
    ` sizes="${escapeAttribute(image.sizes)}"`,
    ` alt="${escapeAttribute(image.alt)}"`,
    ` width="${image.width}"`,
    ` height="${image.height}"`,
    ` loading="lazy"`,
    ` decoding="async"`,
    `>`,
  ].join("");
};

const renderHomepageJournalListingItem = (
  entry: AppRenderContextHomepageJournalListingBlock["entries"][number],
): string =>
  [
    `<article class="m-homepage-journal-listing__item">`,
    entry.publishedLabel
      ? `<p class="m-homepage-journal-listing__item-date">${escapeHtml(entry.publishedLabel)}</p>`
      : "",
    `<h3 class="m-homepage-journal-listing__title">`,
    `<a class="m-homepage-journal-listing__link" href="${escapeAttribute(entry.href)}">${escapeHtml(entry.title)}</a>`,
    `</h3>`,
    `<a class="m-homepage-journal-listing__item-action" href="${escapeAttribute(entry.href)}">Read entry</a>`,
    `</article>`,
  ].join("");

export const renderHomepageJournalListingBlock = (
  module: AppRenderContextHomepageJournalListingBlock,
): string => {
  const [featured, ...entries] = module.entries;

  if (featured === undefined) {
    return "";
  }

  return [
    `<section class="m-homepage-journal-listing l-content">`,
    renderHeading(module.heading, {
      className: "m-homepage-journal-listing__heading",
    }),
    `<article class="m-homepage-journal-listing__featured">`,
    `<a class="m-homepage-journal-listing__media-link" href="${escapeAttribute(featured.href)}">`,
    renderHomepageJournalListingImage(featured.image),
    `</a>`,
    `<div class="m-homepage-journal-listing__featured-content">`,
    featured.publishedLabel
      ? `<p class="m-homepage-journal-listing__date">${escapeHtml(featured.publishedLabel)}</p>`
      : "",
    `<h3 class="m-homepage-journal-listing__featured-title">`,
    `<a class="m-homepage-journal-listing__featured-link" href="${escapeAttribute(featured.href)}">${escapeHtml(featured.title)}</a>`,
    `</h3>`,
    featured.intro
      ? `<p class="m-homepage-journal-listing__featured-intro">${escapeHtml(featured.intro)}</p>`
      : "",
    `<a class="m-homepage-journal-listing__action" href="${escapeAttribute(featured.href)}">Read entry</a>`,
    `</div>`,
    `</article>`,
    `<div class="m-homepage-journal-listing__list">`,
    entries.map(renderHomepageJournalListingItem).join(""),
    `</div>`,
    `</section>`,
  ].join("");
};
