// src/app-state/resolve/page-content/block/homepage-note-listing/homepage-note-listing.resolve.app-state.test.ts

import { appStateResolveHomepageNoteListingBlock } from "@app-state/resolve/page-content/block/homepage-note-listing/homepage-note-listing.resolve.app-state";

import { appStateResolveArticleSectionHeadingBlock } from "@app-state/resolve/page-content/block/article-section/article-section.resolve.app-state";

jest.mock(
  "@app-state/resolve/page-content/block/article-section/article-section.resolve.app-state",
  () => ({
    appStateResolveArticleSectionHeadingBlock: jest.fn(),
  }),
);

describe("appStateResolveHomepageNoteListingBlock", () => {
  const mockedAppStateResolveArticleSectionHeadingBlock = jest.mocked(
    appStateResolveArticleSectionHeadingBlock,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("applies deterministic defaults", () => {
    const heading = {
      text: "Latest notes",
      level: 2,
    };

    const resolvedHeading = {
      text: "Latest notes",
      level: 2,
      visuallyHidden: false,
    };

    mockedAppStateResolveArticleSectionHeadingBlock.mockReturnValue(
      resolvedHeading as never,
    );

    expect(
      appStateResolveHomepageNoteListingBlock({
        kind: "homepageNoteListing",
        heading,
      } as never),
    ).toEqual({
      kind: "homepageNoteListing",
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
      text: "Latest technical notes",
      level: 3,
      visuallyHidden: true,
    };

    const resolvedHeading = {
      text: "Latest technical notes",
      level: 3,
      visuallyHidden: true,
    };

    mockedAppStateResolveArticleSectionHeadingBlock.mockReturnValue(
      resolvedHeading as never,
    );

    expect(
      appStateResolveHomepageNoteListingBlock({
        kind: "homepageNoteListing",
        heading,
        itemCount: 3,
      } as never),
    ).toEqual({
      kind: "homepageNoteListing",
      heading: resolvedHeading,
      flow: "content",
      itemCount: 3,
    });
  });
});
