// src/app-render-context/resolve/body-content/block/journal-listing.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextJournalListingBlock } from "@shared-types/page-content/block/journal-listing/app-context.journal-listing.block.types";

import { appRenderContextResolveJournalListingBlock } from "@app-render-context/resolve/body-content/block/journal-listing.resolve.app-render-context";
import { appRenderContextResolvePagination } from "@app-render-context/resolve/body-content/shared/pagination.resolve.app-render-context";
import { appRenderContextResolvePhoto } from "@app-render-context/resolve/media/photo.resolve.app-render-context";
import { formatDate } from "@utils/date.format.util";

jest.mock(
  "@app-render-context/resolve/body-content/shared/pagination.resolve.app-render-context",
  () => ({
    appRenderContextResolvePagination: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/media/photo.resolve.app-render-context",
  () => ({
    appRenderContextResolvePhoto: jest.fn(),
  }),
);

jest.mock("@utils/date.format.util", () => ({
  formatDate: jest.fn(),
}));

const createAppContext = (): AppContext =>
  ({
    metadataLabels: {
      context: "Context",
      settings: "Settings",
    },
  }) as unknown as AppContext;

const createBlock = (
  overrides: Partial<AppContextJournalListingBlock> = {},
): AppContextJournalListingBlock => ({
  kind: "journalListing",
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

describe("appRenderContextResolveJournalListingBlock", () => {
  const mockedAppRenderContextResolvePagination = jest.mocked(
    appRenderContextResolvePagination,
  );
  const mockedAppRenderContextResolvePhoto = jest.mocked(
    appRenderContextResolvePhoto,
  );
  const mockedFormatDate = jest.mocked(formatDate);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves pagination, image, and published label for listing items", () => {
    mockedAppRenderContextResolvePagination.mockReturnValue({
      pageSize: 10,
      currentPage: 2,
      totalItems: 12,
      totalPages: 2,
      previousHref: "/journal",
      nextHref: null,
      label: "Page 2 of 2",
      previousLabel: "← Newer entries",
      nextLabel: "Older entries →",
    });

    mockedFormatDate.mockReturnValue("9 May 2026");

    const sourceImage = {
      id: "coot-entry-image",
    };

    const resolvedImage = {
      id: "coot-entry-image",
      src: "/media/photo/coot-entry-image",
    };

    mockedAppRenderContextResolvePhoto.mockReturnValue(resolvedImage as never);

    const block = createBlock({
      pagination: {
        pageSize: 10,
        currentPage: 2,
        totalItems: 12,
        totalPages: 2,
        previousHref: "/journal",
        nextHref: null,
      },
      items: [
        {
          id: "coot-entry",
          href: "/journal/coot-entry",
          title: "Coot nesting behaviour",
          intro: "A quiet field note about coots.",
          eyebrow: "Field note",
          publishedAt: "2026-05-09T08:00:00.000Z",
          image: sourceImage as never,
        },
      ],
    });

    expect(
      appRenderContextResolveJournalListingBlock(createAppContext(), block),
    ).toEqual({
      ...block,
      pagination: {
        pageSize: 10,
        currentPage: 2,
        totalItems: 12,
        totalPages: 2,
        previousHref: "/journal",
        nextHref: null,
        label: "Page 2 of 2",
        previousLabel: "← Newer entries",
        nextLabel: "Older entries →",
      },
      items: [
        {
          id: "coot-entry",
          href: "/journal/coot-entry",
          title: "Coot nesting behaviour",
          intro: "A quiet field note about coots.",
          eyebrow: "Field note",
          publishedAt: "2026-05-09T08:00:00.000Z",
          image: resolvedImage,
          publishedLabel: "9 May 2026",
        },
      ],
    });

    expect(mockedAppRenderContextResolvePagination).toHaveBeenCalledWith(
      block.pagination,
    );
    expect(mockedFormatDate).toHaveBeenCalledWith("2026-05-09T08:00:00.000Z");
    expect(mockedAppRenderContextResolvePhoto).toHaveBeenCalledWith(
      sourceImage,
      {
        context: "Context",
        settings: "Settings",
      },
    );
  });

  it("preserves null image and published label values", () => {
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
          id: "quiet-entry",
          href: "/journal/quiet-entry",
          title: "Quiet observations",
          intro: null,
          eyebrow: null,
          publishedAt: null,
          image: null,
        },
      ],
    });

    expect(
      appRenderContextResolveJournalListingBlock(createAppContext(), block),
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
          id: "quiet-entry",
          href: "/journal/quiet-entry",
          title: "Quiet observations",
          intro: null,
          eyebrow: null,
          publishedAt: null,
          image: null,
          publishedLabel: null,
        },
      ],
    });

    expect(mockedFormatDate).not.toHaveBeenCalled();
    expect(mockedAppRenderContextResolvePhoto).not.toHaveBeenCalled();
  });
});
