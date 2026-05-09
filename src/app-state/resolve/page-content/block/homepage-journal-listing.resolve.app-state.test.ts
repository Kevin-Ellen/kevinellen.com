// src/app-state/resolve/page-content/block/homepage-journal-listing.resolve.app-state.test.ts

import { appStateResolveHomepageJournalListingBlock } from "@app-state/resolve/page-content/block/homepage-journal-listing.resolve.app-state";

import { appStateResolveArticleSectionHeadingBlock } from "@app-state/resolve/page-content/block/article-section.resolve.app-state";

jest.mock(
  "@app-state/resolve/page-content/block/article-section.resolve.app-state",
  () => ({
    appStateResolveArticleSectionHeadingBlock: jest.fn(),
  }),
);

describe("appStateResolveHomepageJournalListingBlock", () => {
  const mockedAppStateResolveArticleSectionHeadingBlock = jest.mocked(
    appStateResolveArticleSectionHeadingBlock,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("applies deterministic defaults", () => {
    const heading = {
      text: "Latest field notes",
      level: 2,
    };

    const resolvedHeading = {
      text: "Latest field notes",
      level: 2,
      visuallyHidden: false,
    };

    mockedAppStateResolveArticleSectionHeadingBlock.mockReturnValue(
      resolvedHeading as never,
    );

    expect(
      appStateResolveHomepageJournalListingBlock({
        kind: "homepageJournalListing",
        heading,
      } as never),
    ).toEqual({
      kind: "homepageJournalListing",
      heading: resolvedHeading,
      flow: "content",
      itemCount: 5,
    });

    expect(
      mockedAppStateResolveArticleSectionHeadingBlock,
    ).toHaveBeenCalledWith(heading);
  });

  it("preserves authored item count", () => {
    const heading = {
      text: "Latest journal entries",
      level: 3,
      visuallyHidden: true,
    };

    const resolvedHeading = {
      text: "Latest journal entries",
      level: 3,
      visuallyHidden: true,
    };

    mockedAppStateResolveArticleSectionHeadingBlock.mockReturnValue(
      resolvedHeading as never,
    );

    expect(
      appStateResolveHomepageJournalListingBlock({
        kind: "homepageJournalListing",
        heading,
        itemCount: 3,
      } as never),
    ).toEqual({
      kind: "homepageJournalListing",
      heading: resolvedHeading,
      flow: "content",
      itemCount: 3,
    });
  });
});
