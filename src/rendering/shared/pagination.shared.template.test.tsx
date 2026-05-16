// src/rendering/shared/pagination.shared.template.test.tsx

import { renderToStaticMarkup } from "react-dom/server";

import type { AppRenderContextPagination } from "@shared-types/page-content/shared/pagination/app-render-context.pagination.shared.types";

import { PaginationTemplate } from "@rendering/shared/pagination.shared.template";

const pagination = (
  overrides: Partial<AppRenderContextPagination> = {},
): AppRenderContextPagination =>
  ({
    totalPages: 3,
    previousHref: "/journal/page/1",
    previousLabel: "Previous",
    label: "Page 2 of 3",
    nextHref: "/journal/page/3",
    nextLabel: "Next",
    ...overrides,
  }) as AppRenderContextPagination;

describe("PaginationTemplate", () => {
  it("renders pagination with previous and next links", () => {
    expect(
      renderToStaticMarkup(<PaginationTemplate pagination={pagination()} />),
    ).toBe(
      '<nav class="m-pagination" aria-label="Pagination"><div class="m-pagination__slot m-pagination__slot--previous"><a class="m-pagination__link m-pagination__link--previous" href="/journal/page/1">Previous</a></div><div class="m-pagination__slot m-pagination__slot--label"><span class="m-pagination__label">Page 2 of 3</span></div><div class="m-pagination__slot m-pagination__slot--next"><a class="m-pagination__link m-pagination__link--next" href="/journal/page/3">Next</a></div></nav>',
    );
  });

  it("renders a custom aria label", () => {
    const html = renderToStaticMarkup(
      <PaginationTemplate
        pagination={pagination()}
        ariaLabel="Journal pagination"
      />,
    );

    expect(html).toContain('aria-label="Journal pagination"');
  });

  it("renders empty previous and next slots when links are not available", () => {
    expect(
      renderToStaticMarkup(
        <PaginationTemplate
          pagination={pagination({
            previousHref: null,
            nextHref: null,
          })}
        />,
      ),
    ).toBe(
      '<nav class="m-pagination" aria-label="Pagination"><div class="m-pagination__slot m-pagination__slot--previous"></div><div class="m-pagination__slot m-pagination__slot--label"><span class="m-pagination__label">Page 2 of 3</span></div><div class="m-pagination__slot m-pagination__slot--next"></div></nav>',
    );
  });

  it("does not render when there is only one page", () => {
    expect(
      renderToStaticMarkup(
        <PaginationTemplate pagination={pagination({ totalPages: 1 })} />,
      ),
    ).toBe("");
  });
});
