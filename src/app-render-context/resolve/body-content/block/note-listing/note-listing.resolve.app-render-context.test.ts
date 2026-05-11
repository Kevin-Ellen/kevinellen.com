// src/app-render-context/resolve/body-content/block/note-listing/note-listing.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextNoteListingBlock } from "@shared-types/page-content/block/note-listing/app-context.note-listing.block.types";

import { appRenderContextResolveNoteListingBlock } from "@app-render-context/resolve/body-content/block/note-listing/note-listing.resolve.app-render-context";
import { appRenderContextResolvePagination } from "@app-render-context/resolve/body-content/shared/pagination.resolve.app-render-context";
import { formatDate } from "@utils/date.format.util";

jest.mock(
  "@app-render-context/resolve/body-content/shared/pagination.resolve.app-render-context",
  () => ({
    appRenderContextResolvePagination: jest.fn(),
  }),
);

jest.mock("@utils/date.format.util", () => ({
  formatDate: jest.fn(),
}));

const createAppContext = (): AppContext => ({}) as AppContext;

const createBlock = (
  overrides: Partial<AppContextNoteListingBlock> = {},
): AppContextNoteListingBlock => ({
  kind: "noteListing",
  flow: "content",
  pagination: {
    pageSize: 10,
    currentPage: 1,
    totalItems: 1,
    totalPages: 1,
    previousHref: null,
    nextHref: null,
  },
  items: [],
  ...overrides,
});

describe("appRenderContextResolveNoteListingBlock", () => {
  const mockedAppRenderContextResolvePagination = jest.mocked(
    appRenderContextResolvePagination,
  );

  const mockedFormatDate = jest.mocked(formatDate);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves pagination and published label for listing items", () => {
    mockedAppRenderContextResolvePagination.mockReturnValue({
      pageSize: 10,
      currentPage: 2,
      totalItems: 12,
      totalPages: 2,
      previousHref: "/notes",
      nextHref: null,
      label: "Page 2 of 2",
      previousLabel: "← Newer entries",
      nextLabel: "Older entries →",
    });

    mockedFormatDate.mockReturnValue("10 May 2026");

    const block = createBlock({
      pagination: {
        pageSize: 10,
        currentPage: 2,
        totalItems: 12,
        totalPages: 2,
        previousHref: "/notes",
        nextHref: null,
      },
      items: [
        {
          id: "note:building-this-website-was-worth-it",
          href: "/notes/building-this-website-was-worth-it",
          title: "Building this website was worth it",
          intro: "A technical note about building the site.",
          eyebrow: "Note",
          publishedAt: "2026-05-10T22:14:49+01:00",
          topic: "Architecture",
        },
      ],
    });

    expect(
      appRenderContextResolveNoteListingBlock(createAppContext(), block),
    ).toEqual({
      ...block,
      pagination: {
        pageSize: 10,
        currentPage: 2,
        totalItems: 12,
        totalPages: 2,
        previousHref: "/notes",
        nextHref: null,
        label: "Page 2 of 2",
        previousLabel: "← Newer entries",
        nextLabel: "Older entries →",
      },
      items: [
        {
          id: "note:building-this-website-was-worth-it",
          href: "/notes/building-this-website-was-worth-it",
          title: "Building this website was worth it",
          intro: "A technical note about building the site.",
          eyebrow: "Note",
          publishedAt: "2026-05-10T22:14:49+01:00",
          publishedLabel: "10 May 2026",
          topic: "Architecture",
        },
      ],
    });

    expect(mockedAppRenderContextResolvePagination).toHaveBeenCalledWith(
      block.pagination,
    );

    expect(mockedFormatDate).toHaveBeenCalledWith("2026-05-10T22:14:49+01:00");
  });

  it("preserves null published label values", () => {
    mockedAppRenderContextResolvePagination.mockReturnValue({
      pageSize: 10,
      currentPage: 1,
      totalItems: 1,
      totalPages: 1,
      previousHref: null,
      nextHref: null,
      label: "Page 1 of 1",
      previousLabel: "← Newer entries",
      nextLabel: "Older entries →",
    });

    const block = createBlock({
      items: [
        {
          id: "note:quiet-note",
          href: "/notes/quiet-note",
          title: "Quiet Note",
          intro: null,
          eyebrow: null,
          publishedAt: null,
          topic: null,
        },
      ],
    });

    expect(
      appRenderContextResolveNoteListingBlock(createAppContext(), block),
    ).toEqual({
      ...block,
      pagination: {
        pageSize: 10,
        currentPage: 1,
        totalItems: 1,
        totalPages: 1,
        previousHref: null,
        nextHref: null,
        label: "Page 1 of 1",
        previousLabel: "← Newer entries",
        nextLabel: "Older entries →",
      },
      items: [
        {
          id: "note:quiet-note",
          href: "/notes/quiet-note",
          title: "Quiet Note",
          intro: null,
          eyebrow: null,
          publishedAt: null,
          publishedLabel: null,
          topic: null,
        },
      ],
    });

    expect(mockedFormatDate).not.toHaveBeenCalled();
  });
});
