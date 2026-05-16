// src/app-context/resolve/page-content/block/homepage-journal-listing/homepage-journal-listing.resolve.app-context.test.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppStateHomepageJournalListingBlock } from "@shared-types/page-content/block/homepage-journal-listing/app-state.homepage-journal-listing.block.types";

import { appContextResolveHomepageJournalListingBlock } from "@app-context/resolve/page-content/block/homepage-journal-listing/homepage-journal-listing.resolve.app-context";

import { appContextResolveJournalListingItems } from "@app-context/resolve/page-content/shared/journal-listing-items.resolve.app-context";

jest.mock(
  "@app-context/resolve/page-content/shared/journal-listing-items.resolve.app-context",
  () => ({
    appContextResolveJournalListingItems: jest.fn(),
  }),
);

const imageDelivery = {
  homepageJournalFeature: {
    sizes: "(min-width: 1200px) 740px, calc(100vw - 2rem)",
    widths: [640, 960, 1280],
  },
} as const;

describe("appContextResolveHomepageJournalListingBlock", () => {
  const mockedAppContextResolveJournalListingItems = jest.mocked(
    appContextResolveJournalListingItems,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("limits entries to the configured item count", () => {
    const context = {
      imageDelivery,
    } as unknown as AppContextPageContentResolverContext;

    const module: AppStateHomepageJournalListingBlock = {
      kind: "homepageJournalListing",
      heading: {
        text: "Latest field notes",
        level: 2,
        visuallyHidden: false,
      },
      itemCount: 2,
      flow: "content",
    };

    mockedAppContextResolveJournalListingItems.mockReturnValue([
      {
        id: "one",
        href: "/journal/one",
        title: "One",
        intro: "Intro one",
        eyebrow: "Journal",
        publishedAt: "2025-01-01",
        image: null,
      },
      {
        id: "two",
        href: "/journal/two",
        title: "Two",
        intro: "Intro two",
        eyebrow: "Journal",
        publishedAt: "2025-01-02",
        image: null,
      },
      {
        id: "three",
        href: "/journal/three",
        title: "Three",
        intro: "Intro three",
        eyebrow: "Journal",
        publishedAt: "2025-01-03",
        image: null,
      },
    ]);

    const result = appContextResolveHomepageJournalListingBlock(
      module,
      context,
    );

    expect(result).toEqual({
      kind: "homepageJournalListing",
      heading: {
        text: "Latest field notes",
        level: 2,
        visuallyHidden: false,
      },
      itemCount: 2,
      flow: "content",
      entries: [
        {
          id: "one",
          href: "/journal/one",
          title: "One",
          intro: "Intro one",
          eyebrow: "Journal",
          publishedAt: "2025-01-01",
          image: null,
        },
        {
          id: "two",
          href: "/journal/two",
          title: "Two",
          intro: "Intro two",
          eyebrow: "Journal",
          publishedAt: "2025-01-02",
          image: null,
        },
      ],
    });

    expect(mockedAppContextResolveJournalListingItems).toHaveBeenCalledTimes(1);
    expect(mockedAppContextResolveJournalListingItems).toHaveBeenCalledWith(
      context,
      imageDelivery.homepageJournalFeature,
    );
  });

  it("returns empty entries when no journal items exist", () => {
    const context = {
      imageDelivery,
    } as unknown as AppContextPageContentResolverContext;

    const module: AppStateHomepageJournalListingBlock = {
      kind: "homepageJournalListing",
      heading: {
        text: "Latest field notes",
        level: 2,
        visuallyHidden: false,
      },
      itemCount: 2,
      flow: "content",
    };

    mockedAppContextResolveJournalListingItems.mockReturnValue([]);

    const result = appContextResolveHomepageJournalListingBlock(
      module,
      context,
    );

    expect(result).toEqual({
      kind: "homepageJournalListing",
      heading: {
        text: "Latest field notes",
        level: 2,
        visuallyHidden: false,
      },
      itemCount: 2,
      flow: "content",
      entries: [],
    });

    expect(mockedAppContextResolveJournalListingItems).toHaveBeenCalledWith(
      context,
      imageDelivery.homepageJournalFeature,
    );
  });
});
