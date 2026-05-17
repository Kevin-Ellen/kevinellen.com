// src/app-render-context/resolve/body-content/shared/pagination.resolve.app-render-context.test.ts

import type { AppContextPagination } from "@shared-types/page-content/shared/pagination/app-context.pagination.shared.types";

import { appRenderContextResolvePagination } from "@app-render-context/resolve/body-content/shared/pagination.resolve.app-render-context";

describe("appRenderContextResolvePagination", () => {
  it("adds render labels to pagination", () => {
    const pagination: AppContextPagination = {
      pageSize: 10,
      currentPage: 2,
      totalItems: 42,
      totalPages: 5,
      previousHref: "/journal",
      nextHref: "/journal/page-3",
    };

    expect(appRenderContextResolvePagination(pagination)).toEqual({
      ...pagination,
      label: "Page 2 of 5",
      previousLabel: "← Newer entries",
      nextLabel: "Older entries →",
    });
  });

  it("preserves null previous and next hrefs", () => {
    const pagination: AppContextPagination = {
      pageSize: 10,
      currentPage: 1,
      totalItems: 0,
      totalPages: 1,
      previousHref: null,
      nextHref: null,
    };

    expect(appRenderContextResolvePagination(pagination)).toEqual({
      ...pagination,
      label: "Page 1 of 1",
      previousLabel: "← Newer entries",
      nextLabel: "Older entries →",
    });
  });
});
