// tests/src/app-context/resolve/page/content/shared/pagination.resolve.app-context.test.ts

import { resolvePaginationAppContext } from "@app-context/resolve/page/content/shared/pagination.resolve.app-context";

describe("resolvePaginationAppContext", () => {
  it("resolves first page pagination", () => {
    expect(
      resolvePaginationAppContext({
        pagination: { pageSize: 2 },
        currentPage: 1,
        totalItems: 5,
        baseHref: "/journal",
      }),
    ).toEqual({
      pageSize: 2,
      currentPage: 1,
      totalItems: 5,
      totalPages: 3,
      previousHref: null,
      nextHref: "/journal/page-2",
    });
  });

  it("resolves middle page pagination", () => {
    expect(
      resolvePaginationAppContext({
        pagination: { pageSize: 2 },
        currentPage: 2,
        totalItems: 5,
        baseHref: "/journal",
      }),
    ).toEqual({
      pageSize: 2,
      currentPage: 2,
      totalItems: 5,
      totalPages: 3,
      previousHref: "/journal",
      nextHref: "/journal/page-3",
    });
  });

  it("resolves last page pagination", () => {
    expect(
      resolvePaginationAppContext({
        pagination: { pageSize: 2 },
        currentPage: 3,
        totalItems: 5,
        baseHref: "/journal",
      }),
    ).toEqual({
      pageSize: 2,
      currentPage: 3,
      totalItems: 5,
      totalPages: 3,
      previousHref: "/journal/page-2",
      nextHref: null,
    });
  });

  it("returns zero total pages when there are no items", () => {
    expect(
      resolvePaginationAppContext({
        pagination: { pageSize: 10 },
        currentPage: 1,
        totalItems: 0,
        baseHref: "/journal",
      }),
    ).toEqual({
      pageSize: 10,
      currentPage: 1,
      totalItems: 0,
      totalPages: 0,
      previousHref: null,
      nextHref: null,
    });
  });
});
