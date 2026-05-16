// src/rendering/shared/pagination.shared.template.tsx

import type { AppRenderContextPagination } from "@shared-types/page-content/shared/pagination/app-render-context.pagination.shared.types";

type PaginationTemplateProps = Readonly<{
  pagination: AppRenderContextPagination;
  ariaLabel?: string;
}>;

export const PaginationTemplate = ({
  pagination,
  ariaLabel = "Pagination",
}: PaginationTemplateProps) => {
  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <nav className="m-pagination" aria-label={ariaLabel}>
      <div className="m-pagination__slot m-pagination__slot--previous">
        {pagination.previousHref ? (
          <a
            className="m-pagination__link m-pagination__link--previous"
            href={pagination.previousHref}
          >
            {pagination.previousLabel}
          </a>
        ) : null}
      </div>

      <div className="m-pagination__slot m-pagination__slot--label">
        <span className="m-pagination__label">{pagination.label}</span>
      </div>

      <div className="m-pagination__slot m-pagination__slot--next">
        {pagination.nextHref ? (
          <a
            className="m-pagination__link m-pagination__link--next"
            href={pagination.nextHref}
          >
            {pagination.nextLabel}
          </a>
        ) : null}
      </div>
    </nav>
  );
};
