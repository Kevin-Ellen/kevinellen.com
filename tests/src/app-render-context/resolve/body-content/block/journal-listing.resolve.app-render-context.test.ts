// tests/src/app-render-context/resolve/body-content/block/journal-listing.resolve.app-render-context.test.ts

import { resolveJournalListingBlockContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/block/journal-listing.resolve.app-render-context";

import { formatDate } from "@utils/date.format.util";
import { resolvePaginationAppRenderContext } from "@app-render-context/resolve/body-content/shared/pagination.resolve.app-render-context";
import { resolvePhotoAppRenderContext } from "@app-render-context/resolve/media/photo.resolve.app-render-context";

import type { AppContext } from "@app-context/class.app-context";

jest.mock("@utils/date.format.util", () => ({
  formatDate: jest.fn(),
}));

jest.mock(
  "@app-render-context/resolve/body-content/shared/pagination.resolve.app-render-context",
  () => ({
    resolvePaginationAppRenderContext: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/media/photo.resolve.app-render-context",
  () => ({
    resolvePhotoAppRenderContext: jest.fn(),
  }),
);

describe("resolveJournalListingBlockContentModuleAppRenderContext", () => {
  const mockedFormatDate = jest.mocked(formatDate);
  const mockedResolvePaginationAppRenderContext = jest.mocked(
    resolvePaginationAppRenderContext,
  );
  const mockedResolvePhotoAppRenderContext = jest.mocked(
    resolvePhotoAppRenderContext,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves pagination, item images, and published labels", () => {
    const metadataLabels = {
      location: "Location",
      capturedAt: "Captured",
      shutterSpeed: "Shutter speed",
      aperture: "Aperture",
      focalLength: "Focal length",
      iso: "ISO",
    };

    const appContext = {
      metadataLabels,
    } as unknown as AppContext;

    const pagination = {
      currentPage: 2,
      totalPages: 4,
    };

    const image = {
      id: "mallorca-glossy-ibis",
    };

    const resolvedPagination = {
      current: 2,
      total: 4,
    };

    const resolvedImage = {
      id: "mallorca-glossy-ibis",
      alt: "Glossy ibis in flight",
    };

    const module = {
      kind: "journalListing",
      pagination,
      items: [
        {
          href: "/journal/mallorca-glossy-ibis",
          title: "Unexpected encounters at S’Albufera",
          summary: "A Glossy Ibis appears over the reeds.",
          image,
          publishedAt: "2026-05-01",
        },
        {
          href: "/journal/no-photo",
          title: "A quieter journal entry",
          summary: "No hero image this time.",
          image: null,
          publishedAt: null,
        },
      ],
    };

    mockedResolvePaginationAppRenderContext.mockReturnValue(
      resolvedPagination as never,
    );
    mockedResolvePhotoAppRenderContext.mockReturnValue(resolvedImage as never);
    mockedFormatDate.mockReturnValue("1 May 2026");

    const result = resolveJournalListingBlockContentModuleAppRenderContext(
      appContext,
      module as never,
    );

    expect(mockedResolvePaginationAppRenderContext).toHaveBeenCalledWith(
      pagination,
    );
    expect(mockedResolvePhotoAppRenderContext).toHaveBeenCalledWith(
      image,
      metadataLabels,
    );
    expect(mockedResolvePhotoAppRenderContext).toHaveBeenCalledTimes(1);
    expect(mockedFormatDate).toHaveBeenCalledWith("2026-05-01");
    expect(mockedFormatDate).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      ...module,
      pagination: resolvedPagination,
      items: [
        {
          ...module.items[0],
          image: resolvedImage,
          publishedLabel: "1 May 2026",
        },
        {
          ...module.items[1],
          image: null,
          publishedLabel: null,
        },
      ],
    });
  });
});
