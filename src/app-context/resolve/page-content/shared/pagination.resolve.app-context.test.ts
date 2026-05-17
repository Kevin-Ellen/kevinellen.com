// src/app-context/resolve/page-content/shared/pagination.resolve.app-context.test.ts

import type { AppStatePagination } from "@shared-types/page-content/shared/pagination/app-state.pagination.shared.types";

import { appContextResolvePagination } from "@app-context/resolve/page-content/shared/pagination.resolve.app-context";

describe("appContextResolvePagination", () => {
  const pagination: AppStatePagination = {
    pageSize: 10,
  };

  it("resolves first-page pagination", () => {
    expect(
      appContextResolvePagination({
        pagination,
        currentPage: 1,
        totalItems: 25,
        baseHref: "/journal",
      }),
    ).toEqual({
      pageSize: 10,
      currentPage: 1,
      totalItems: 25,
      totalPages: 3,
      previousHref: null,
      nextHref: "/journal/page-2",
    });
  });

  it("resolves middle-page pagination", () => {
    expect(
      appContextResolvePagination({
        pagination,
        currentPage: 2,
        totalItems: 25,
        baseHref: "/journal",
      }),
    ).toEqual({
      pageSize: 10,
      currentPage: 2,
      totalItems: 25,
      totalPages: 3,
      previousHref: "/journal",
      nextHref: "/journal/page-3",
    });
  });

  it("resolves final-page pagination", () => {
    expect(
      appContextResolvePagination({
        pagination,
        currentPage: 3,
        totalItems: 25,
        baseHref: "/journal",
      }),
    ).toEqual({
      pageSize: 10,
      currentPage: 3,
      totalItems: 25,
      totalPages: 3,
      previousHref: "/journal/page-2",
      nextHref: null,
    });
  });

  it("resolves a single-page result set", () => {
    expect(
      appContextResolvePagination({
        pagination,
        currentPage: 1,
        totalItems: 5,
        baseHref: "/journal",
      }),
    ).toEqual({
      pageSize: 10,
      currentPage: 1,
      totalItems: 5,
      totalPages: 1,
      previousHref: null,
      nextHref: null,
    });
  });

  it("resolves empty result sets with zero total pages", () => {
    expect(
      appContextResolvePagination({
        pagination,
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
