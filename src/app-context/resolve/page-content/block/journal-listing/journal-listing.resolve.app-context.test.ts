// src/app-context/resolve/page-content/block/journal-listing/journal-listing.resolve.app-context.test.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppStateJournalListingBlock } from "@shared-types/page-content/block/journal-listing/app-state.journal-listing.block.types";

import { appContextResolveJournalListingBlock } from "@app-context/resolve/page-content/block/journal-listing/journal-listing.resolve.app-context";

import { appContextResolveJournalListingItems } from "@app-context/resolve/page-content/shared/journal-listing-items.resolve.app-context";
import { appContextResolvePagination } from "@app-context/resolve/page-content/shared/pagination.resolve.app-context";

jest.mock(
  "@app-context/resolve/page-content/shared/journal-listing-items.resolve.app-context",
  () => ({
    appContextResolveJournalListingItems: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page-content/shared/pagination.resolve.app-context",
  () => ({
    appContextResolvePagination: jest.fn(),
  }),
);

const createModule = (): AppStateJournalListingBlock => ({
  kind: "journalListing",
  flow: "content",
  pagination: {
    pageSize: 2,
  },
});

describe("appContextResolveJournalListingBlock", () => {
  const mockedAppContextResolveJournalListingItems = jest.mocked(
    appContextResolveJournalListingItems,
  );

  const mockedAppContextResolvePagination = jest.mocked(
    appContextResolvePagination,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves paginated journal listing items for the current page", () => {
    const module = createModule();

    const context = {
      currentPageSlug: "/journal",
      routingPagination: {
        currentPage: 2,
      },
    } as AppContextPageContentResolverContext;

    const journalItems = [
      { id: "one" },
      { id: "two" },
      { id: "three" },
      { id: "four" },
      { id: "five" },
    ];

    mockedAppContextResolveJournalListingItems.mockReturnValue(
      journalItems as never,
    );

    mockedAppContextResolvePagination.mockReturnValue({
      pageSize: 2,
      currentPage: 2,
      totalItems: 5,
      totalPages: 3,
      previousHref: "/journal",
      nextHref: "/journal/page-3",
    });

    const result = appContextResolveJournalListingBlock(module, context);

    expect(result).toEqual({
      kind: "journalListing",
      flow: "content",
      pagination: {
        pageSize: 2,
        currentPage: 2,
        totalItems: 5,
        totalPages: 3,
        previousHref: "/journal",
        nextHref: "/journal/page-3",
      },
      items: [{ id: "three" }, { id: "four" }],
    });

    expect(mockedAppContextResolveJournalListingItems).toHaveBeenCalledWith(
      context,
    );

    expect(mockedAppContextResolvePagination).toHaveBeenCalledWith({
      pagination: module.pagination,
      currentPage: 2,
      totalItems: 5,
      baseHref: "/journal",
    });
  });

  it("defaults to page one when no routing pagination exists", () => {
    const module = createModule();

    const context = {
      currentPageSlug: "/journal",
      routingPagination: null,
    } as AppContextPageContentResolverContext;

    mockedAppContextResolveJournalListingItems.mockReturnValue([
      { id: "one" },
      { id: "two" },
      { id: "three" },
    ] as never);

    mockedAppContextResolvePagination.mockReturnValue({
      pageSize: 2,
      currentPage: 1,
      totalItems: 3,
      totalPages: 2,
      previousHref: null,
      nextHref: "/journal/page-2",
    });

    const result = appContextResolveJournalListingBlock(module, context);

    expect(result.items).toEqual([{ id: "one" }, { id: "two" }]);

    expect(mockedAppContextResolvePagination).toHaveBeenCalledWith({
      pagination: module.pagination,
      currentPage: 1,
      totalItems: 3,
      baseHref: "/journal",
    });
  });

  it("throws when the current page slug is missing", () => {
    const module = createModule();

    const context = {
      currentPageSlug: null,
      routingPagination: null,
    } as AppContextPageContentResolverContext;

    mockedAppContextResolveJournalListingItems.mockReturnValue([]);

    expect(() => appContextResolveJournalListingBlock(module, context)).toThrow(
      "Missing current page slug for journal listing pagination.",
    );
  });
});
