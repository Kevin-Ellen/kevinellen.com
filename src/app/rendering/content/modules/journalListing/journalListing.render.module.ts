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
    <div class="m-journalListing">
      ${module.entries
        .map((entry) => {
          const isFeatured = entry.isFeatured;

          return `
            <article class="m-journalListing__item ${
              isFeatured ? "m-journalListing__item--featured" : ""
            }">
              <a href="${escapeAttribute(entry.href)}" class="m-journalListing__link">

                <div class="m-journalListing__media">
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

                <div class="m-journalListing__content m-heading">
                  <p class="m-journalListing__meta m-heading__eyebrow">
                    <time datetime="${escapeAttribute(entry.publishedAt)}">
                      ${escapeHtmlContent(formatDate(entry.publishedAt))}
                    </time>
                  </p>

                  <h3 class="m-journalListing__title m-heading__title">
                    ${escapeHtmlContent(entry.title)}
                  </h3>

                  ${
                    isFeatured
                      ? `
                    <p class="m-journalListing__intro m-heading__intro">
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
