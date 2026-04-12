// src/app/rendering/content/modules/journalListing/journalListing.render.module.ts

import type { RenderContextJournalListingModule } from "@app/renderContext/content/modules/journalListing/journalListing.module.renderContext.types";

import {
  escapeAttribute,
  escapeHtmlContent,
} from "@app/rendering/utils/escapeContent.util";
import { formatDate } from "@app/rendering/utils/formatDate.util";

export const renderJournalListingModule = (
  module: RenderContextJournalListingModule,
): string => {
  return `
    <div class="m-journal-listing">
      ${module.entries
        .map((entry) => {
          const isFeatured = entry.isFeatured;

          return `
            <article class="m-journal-listing__item ${
              isFeatured ? "m-journal-listing__item--featured" : ""
            }">
              <a href="${escapeAttribute(entry.href)}" class="m-journal-listing__link">

                <div class="m-journal-listing__media">
                  <img
                    src="${escapeAttribute(entry.photo.src)}"
                    ${
                      entry.photo.srcset
                        ? `srcset="${escapeAttribute(entry.photo.srcset)}"`
                        : ""
                    }
                    ${
                      entry.photo.sizes
                        ? `sizes="${escapeAttribute(entry.photo.sizes)}"`
                        : ""
                    }
                    alt="${escapeAttribute(entry.photo.alt)}"
                    width="${entry.photo.width}"
                    height="${entry.photo.height}"
                    loading="lazy"
                  />
                </div>

                <div class="m-journal-listing__content m-heading">
                  <p class="m-journal-listing__meta m-heading__eyebrow">
                    <time datetime="${escapeAttribute(entry.publishedAt)}">
                      ${escapeHtmlContent(formatDate(entry.publishedAt))}
                    </time>
                  </p>

                  <h3 class="m-journal-listing__title m-heading__title">
                    ${escapeHtmlContent(entry.title)}
                  </h3>

                  ${
                    isFeatured
                      ? `
                    <p class="m-journal-listing__intro m-heading__intro">
                      ${escapeHtmlContent(entry.intro)}
                    </p>
                  `
                      : ""
                  }
                </div>

              </a>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
};
