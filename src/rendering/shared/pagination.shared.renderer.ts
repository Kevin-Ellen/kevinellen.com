// src/rendering/shared/pagination.shared.renderer.ts

import type { AppRenderContextPagination } from "@shared-types/page-content/shared/pagination/app-render-context.pagination.page-content.types";

import { escapeHtml } from "@rendering/utils/html.escape.util.renderer";

export const renderPagination = (
  pagination: AppRenderContextPagination,
  ariaLabel = "Pagination",
): string => {
  if (pagination.totalPages <= 1) {
    return "";
  }

  return `<nav class="m-pagination" aria-label="${escapeHtml(ariaLabel)}">
    <div class="m-pagination__slot m-pagination__slot--previous">
      ${
        pagination.previousHref
          ? `<a class="m-pagination__link m-pagination__link--previous" href="${escapeHtml(pagination.previousHref)}">${escapeHtml(pagination.previousLabel)}</a>`
          : ""
      }
    </div>

    <div class="m-pagination__slot m-pagination__slot--label">
      <span class="m-pagination__label">${escapeHtml(pagination.label)}</span>
    </div>

    <div class="m-pagination__slot m-pagination__slot--next">
      ${
        pagination.nextHref
          ? `<a class="m-pagination__link m-pagination__link--next" href="${escapeHtml(pagination.nextHref)}">${escapeHtml(pagination.nextLabel)}</a>`
          : ""
      }
    </div>
  </nav>`;
};
