// src/app-render-context/resolve/body-content/block/homepage-journal-listing/homepage-journal-listing.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextHomepageJournalListingBlock } from "@shared-types/page-content/block/homepage-journal-listing/app-context.homepage-journal-listing.block.types";

import { appRenderContextResolveHomepageJournalListingBlock } from "@app-render-context/resolve/body-content/block/homepage-journal-listing/homepage-journal-listing.resolve.app-render-context";
import { appRenderContextResolvePhoto } from "@app-render-context/resolve/media/photo.resolve.app-render-context";
import { formatDate } from "@utils/date.format.util";

jest.mock(
  "@app-render-context/resolve/media/photo.resolve.app-render-context",
  () => ({
    appRenderContextResolvePhoto: jest.fn(),
  }),
);

jest.mock("@utils/date.format.util", () => ({
  formatDate: jest.fn(),
}));

describe("appRenderContextResolveHomepageJournalListingBlock", () => {
  const mockedAppRenderContextResolvePhoto = jest.mocked(
    appRenderContextResolvePhoto,
  );

  const mockedFormatDate = jest.mocked(formatDate);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves homepage journal listing entries", () => {
    mockedFormatDate.mockReturnValue("9 May 2026");

    const resolvedPhoto = {
      id: "coot-nest",
      src: "/media/photo/coot-nest",
      srcset: "/media/photo/coot-nest/800 800w",
      sizes: "100vw",
      width: 1600,
      height: 1000,
      ratio: "16 / 10",
      alt: "A coot building a nest.",
      title: null,
      caption: null,
      metadata: [],
    };

    mockedAppRenderContextResolvePhoto.mockReturnValue(
      resolvedPhoto as unknown as ReturnType<
        typeof appRenderContextResolvePhoto
      >,
    );

    const block: AppContextHomepageJournalListingBlock = {
      kind: "homepageJournalListing",
      flow: "content",
      itemCount: 3,
      heading: {
        text: "Latest field notes",
        visuallyHidden: false,
        level: 2,
      },
      entries: [
        {
          id: "coot-entry",
          href: "/journal/coot-entry",
          title: "Coot nesting behaviour",
          intro: "Nest handover activity observed at sunrise.",
          eyebrow: "Epping Forest",
          publishedAt: "2026-05-09T08:00:00.000Z",
          image: {
            id: "coot-nest",
          } as never,
        },
      ],
    };

    const appContext = {
      metadataLabels: {
        context: "Context",
        settings: "Settings",
      },
    } as unknown as AppContext;

    expect(
      appRenderContextResolveHomepageJournalListingBlock(appContext, block),
    ).toEqual({
      ...block,
      entries: [
        {
          id: "coot-entry",
          href: "/journal/coot-entry",
          title: "Coot nesting behaviour",
          intro: "Nest handover activity observed at sunrise.",
          eyebrow: "Epping Forest",
          publishedAt: "2026-05-09T08:00:00.000Z",
          publishedLabel: "9 May 2026",
          image: {
            src: resolvedPhoto.src,
            srcset: resolvedPhoto.srcset,
            sizes: resolvedPhoto.sizes,
            alt: resolvedPhoto.alt,
            width: resolvedPhoto.width,
            height: resolvedPhoto.height,
            ratio: resolvedPhoto.ratio,
          },
        },
      ],
    });

    expect(mockedFormatDate).toHaveBeenCalledWith("2026-05-09T08:00:00.000Z");

    expect(mockedAppRenderContextResolvePhoto).toHaveBeenCalledWith(
      { id: "coot-nest" },
      {
        context: "Context",
        settings: "Settings",
      },
    );
  });

  it("returns null publishedLabel and image when values are null", () => {
    const block: AppContextHomepageJournalListingBlock = {
      kind: "homepageJournalListing",
      flow: "content",
      itemCount: 1,
      heading: {
        text: "Latest field notes",
        visuallyHidden: false,
        level: 2,
      },
      entries: [
        {
          id: "untitled-entry",
          href: "/journal/untitled-entry",
          title: "Quiet observations",
          intro: null,
          eyebrow: null,
          publishedAt: null,
          image: null,
        },
      ],
    };

    const appContext = {
      metadataLabels: {
        context: "Context",
        settings: "Settings",
      },
    } as unknown as AppContext;

    expect(
      appRenderContextResolveHomepageJournalListingBlock(appContext, block),
    ).toEqual({
      ...block,
      entries: [
        {
          id: "untitled-entry",
          href: "/journal/untitled-entry",
          title: "Quiet observations",
          intro: null,
          eyebrow: null,
          publishedAt: null,
          publishedLabel: null,
          image: null,
        },
      ],
    });

    expect(mockedFormatDate).not.toHaveBeenCalled();
    expect(mockedAppRenderContextResolvePhoto).not.toHaveBeenCalled();
  });

  it("resolves multiple entries independently", () => {
    mockedFormatDate
      .mockReturnValueOnce("1 May 2026")
      .mockReturnValueOnce("2 May 2026");

    mockedAppRenderContextResolvePhoto
      .mockReturnValueOnce({
        id: "photo-one",
        src: "/media/photo/photo-one",
      } as never)
      .mockReturnValueOnce({
        id: "photo-two",
        src: "/media/photo/photo-two",
      } as never);

    const block: AppContextHomepageJournalListingBlock = {
      kind: "homepageJournalListing",
      flow: "content",
      itemCount: 2,
      heading: {
        text: "Recent entries",
        visuallyHidden: false,
        level: 2,
      },
      entries: [
        {
          id: "entry-one",
          href: "/journal/entry-one",
          title: "Entry One",
          intro: null,
          eyebrow: null,
          publishedAt: "2026-05-01T00:00:00.000Z",
          image: { id: "photo-one" } as never,
        },
        {
          id: "entry-two",
          href: "/journal/entry-two",
          title: "Entry Two",
          intro: null,
          eyebrow: null,
          publishedAt: "2026-05-02T00:00:00.000Z",
          image: { id: "photo-two" } as never,
        },
      ],
    };

    const appContext = {
      metadataLabels: {
        context: "Context",
        settings: "Settings",
      },
    } as unknown as AppContext;

    const result = appRenderContextResolveHomepageJournalListingBlock(
      appContext,
      block,
    );

    expect(result.entries).toHaveLength(2);

    expect(mockedFormatDate).toHaveBeenCalledTimes(2);
    expect(mockedAppRenderContextResolvePhoto).toHaveBeenCalledTimes(2);
  });
});
