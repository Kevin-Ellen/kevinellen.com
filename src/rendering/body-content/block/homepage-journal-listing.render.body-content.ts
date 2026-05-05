// src/render/body-content/block/homepage-journal-listing.render.body-content.ts

import type { AppRenderContextHomepageJournalListingBlock } from "@shared-types/page-content/block/homepage-journal-listing/app-render-context.homepage-journal-listing.block.types";

import { escapeHtml } from "@rendering/utils/html.escape.util.renderer";
import { renderHeading } from "@rendering/shared/heading.body-content.renderer";

const renderImage = (
  image: AppRenderContextHomepageJournalListingBlock["entries"][number]["image"],
): string => {
  if (image === null) return "";

  return `
    <img
      class="m-homepage-journal-listing__image"
      src="${escapeHtml(image.src)}"
      srcset="${escapeHtml(image.srcset.join(", "))}"
      sizes="${escapeHtml(image.sizes)}"
      alt="${escapeHtml(image.alt)}"
      width="${image.width}"
      height="${image.height}"
      loading="lazy"
      decoding="async"
    >
  `;
};

export const renderHomepageJournalListingBlock = (
  module: AppRenderContextHomepageJournalListingBlock,
): string => {
  const [featured, ...entries] = module.entries;

  if (!featured) return "";

  const standardItems = entries
    .map(
      (entry) => `
        <article class="m-homepage-journal-listing__item">
          ${
            entry.publishedLabel
              ? `<p class="m-homepage-journal-listing__item-date">${escapeHtml(entry.publishedLabel)}</p>`
              : ""
          }

          <h3 class="m-homepage-journal-listing__title">
            <a class="m-homepage-journal-listing__link" href="${escapeHtml(entry.href)}">
              ${escapeHtml(entry.title)}
            </a>
          </h3>

          <a class="m-homepage-journal-listing__item-action" href="${escapeHtml(entry.href)}">
            Read entry
          </a>
        </article>
      `,
    )
    .join("");

  return `
<section class="m-homepage-journal-listing l-content">
  ${renderHeading(module.heading, {
    className: "m-homepage-journal-listing__heading",
  })}

  <article class="m-homepage-journal-listing__featured">
    <a class="m-homepage-journal-listing__media-link" href="${escapeHtml(featured.href)}">
      ${renderImage(featured.image)}
    </a>

    <div class="m-homepage-journal-listing__featured-content">
      ${
        featured.publishedLabel
          ? `<p class="m-homepage-journal-listing__date">${escapeHtml(featured.publishedLabel)}</p>`
          : ""
      }

      <h3 class="m-homepage-journal-listing__featured-title">
        <a class="m-homepage-journal-listing__featured-link" href="${escapeHtml(featured.href)}">
          ${escapeHtml(featured.title)}
        </a>
      </h3>

      ${
        featured.intro
          ? `<p class="m-homepage-journal-listing__featured-intro">${escapeHtml(featured.intro)}</p>`
          : ""
      }

      <a class="m-homepage-journal-listing__action" href="${escapeHtml(featured.href)}">
        Read entry
      </a>
    </div>
  </article>

  <div class="m-homepage-journal-listing__list">
    ${standardItems}
  </div>
</section>
`;
};
