// src/rendering/shared/pagination.shared.renderer.test.ts

import type { AppRenderContextPagination } from "@shared-types/page-content/shared/pagination/app-render-context.pagination.shared.types";

import { renderPagination } from "@rendering/shared/pagination.shared.renderer";

const createPagination = (
  overrides: Partial<AppRenderContextPagination> = {},
): AppRenderContextPagination =>
  ({
    currentPage: 2,
    totalPages: 3,
    label: "Page 2 of 3",
    previousHref: "/journal",
    previousLabel: "← Newer entries",
    nextHref: "/journal/page-3",
    nextLabel: "Older entries →",
    ...overrides,
  }) as AppRenderContextPagination;

describe("renderPagination", () => {
  it("returns empty string when there is only one page", () => {
    expect(
      renderPagination(
        createPagination({
          totalPages: 1,
        }),
      ),
    ).toBe("");
  });

  it("renders pagination", () => {
    expect(renderPagination(createPagination(), "Journal pagination")).toBe(
      `<nav class="m-pagination" aria-label="Journal pagination"><div class="m-pagination__slot m-pagination__slot--previous"><a class="m-pagination__link m-pagination__link--previous" href="/journal">← Newer entries</a></div><div class="m-pagination__slot m-pagination__slot--label"><span class="m-pagination__label">Page 2 of 3</span></div><div class="m-pagination__slot m-pagination__slot--next"><a class="m-pagination__link m-pagination__link--next" href="/journal/page-3">Older entries →</a></div></nav>`,
    );
  });

  it("uses the default aria label", () => {
    expect(renderPagination(createPagination())).toContain(
      `aria-label="Pagination"`,
    );
  });

  it("omits previous link when previous href is missing", () => {
    const result = renderPagination(
      createPagination({
        previousHref: null,
      }),
    );

    expect(result).not.toContain("m-pagination__link--previous");
    expect(result).toContain("m-pagination__link--next");
  });

  it("omits next link when next href is missing", () => {
    const result = renderPagination(
      createPagination({
        nextHref: null,
      }),
    );

    expect(result).toContain("m-pagination__link--previous");
    expect(result).not.toContain("m-pagination__link--next");
  });

  it("escapes rendered values", () => {
    const result = renderPagination(
      createPagination({
        label: `Page <bad>`,
        previousHref: `/journal/"bad"`,
        previousLabel: `Newer <entries>`,
        nextHref: `/journal/page-3/"bad"`,
        nextLabel: `Older "entries" <bad>`,
      }),
      `Journal "pagination" <bad>`,
    );

    expect(result).toContain(
      `aria-label="Journal &quot;pagination&quot; &lt;bad&gt;"`,
    );
    expect(result).toContain(`href="/journal/&quot;bad&quot;"`);
    expect(result).toContain(`Newer &lt;entries&gt;`);
    expect(result).toContain(`href="/journal/page-3/&quot;bad&quot;"`);
    expect(result).toContain(`Older &quot;entries&quot; &lt;bad&gt;`);
    expect(result).toContain(`Page &lt;bad&gt;`);
  });
});
