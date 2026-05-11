// src/app-context/resolve/page-content/block/note-listing/note-listing.resolve.app-context.test.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppStateNoteListingBlock } from "@shared-types/page-content/block/note-listing/app-state.note-listing.block.types";

import { appContextResolveNoteListingBlock } from "@app-context/resolve/page-content/block/note-listing/note-listing.resolve.app-context";

import { appContextResolveNoteListingItems } from "@app-context/resolve/page-content/shared/note-listing-items.resolve.app-context";
import { appContextResolvePagination } from "@app-context/resolve/page-content/shared/pagination.resolve.app-context";

jest.mock(
  "@app-context/resolve/page-content/shared/note-listing-items.resolve.app-context",
  () => ({
    appContextResolveNoteListingItems: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page-content/shared/pagination.resolve.app-context",
  () => ({
    appContextResolvePagination: jest.fn(),
  }),
);

const createModule = (): AppStateNoteListingBlock => ({
  kind: "noteListing",
  flow: "content",
  pagination: {
    pageSize: 2,
  },
});

describe("appContextResolveNoteListingBlock", () => {
  const mockedAppContextResolveNoteListingItems = jest.mocked(
    appContextResolveNoteListingItems,
  );

  const mockedAppContextResolvePagination = jest.mocked(
    appContextResolvePagination,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves paginated note listing items for the current page", () => {
    const module = createModule();

    const context = {
      currentPageSlug: "/notes",
      routingPagination: {
        currentPage: 2,
      },
    } as AppContextPageContentResolverContext;

    const noteItems = [
      { id: "one" },
      { id: "two" },
      { id: "three" },
      { id: "four" },
      { id: "five" },
    ];

    mockedAppContextResolveNoteListingItems.mockReturnValue(noteItems as never);

    mockedAppContextResolvePagination.mockReturnValue({
      pageSize: 2,
      currentPage: 2,
      totalItems: 5,
      totalPages: 3,
      previousHref: "/notes",
      nextHref: "/notes/page-3",
    });

    expect(appContextResolveNoteListingBlock(module, context)).toEqual({
      kind: "noteListing",
      flow: "content",
      pagination: {
        pageSize: 2,
        currentPage: 2,
        totalItems: 5,
        totalPages: 3,
        previousHref: "/notes",
        nextHref: "/notes/page-3",
      },
      items: [{ id: "three" }, { id: "four" }],
    });

    expect(mockedAppContextResolveNoteListingItems).toHaveBeenCalledWith(
      context,
    );

    expect(mockedAppContextResolvePagination).toHaveBeenCalledWith({
      pagination: module.pagination,
      currentPage: 2,
      totalItems: 5,
      baseHref: "/notes",
    });
  });

  it("defaults to page one when no routing pagination exists", () => {
    const module = createModule();

    const context = {
      currentPageSlug: "/notes",
      routingPagination: null,
    } as AppContextPageContentResolverContext;

    mockedAppContextResolveNoteListingItems.mockReturnValue([
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
      nextHref: "/notes/page-2",
    });

    const result = appContextResolveNoteListingBlock(module, context);

    expect(result.items).toEqual([{ id: "one" }, { id: "two" }]);

    expect(mockedAppContextResolvePagination).toHaveBeenCalledWith({
      pagination: module.pagination,
      currentPage: 1,
      totalItems: 3,
      baseHref: "/notes",
    });
  });

  it("throws when the current page slug is missing", () => {
    const module = createModule();

    const context = {
      currentPageSlug: null,
      routingPagination: null,
    } as AppContextPageContentResolverContext;

    mockedAppContextResolveNoteListingItems.mockReturnValue([]);

    expect(() => appContextResolveNoteListingBlock(module, context)).toThrow(
      "Missing current page slug for note listing pagination.",
    );
  });
});
