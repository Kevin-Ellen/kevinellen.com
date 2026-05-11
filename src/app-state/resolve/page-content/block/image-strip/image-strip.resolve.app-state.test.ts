// src/app-state/resolve/page-content/block/image-strip/image-strip.resolve.app-state.test.ts

import { appStateResolveImageStripBlock } from "@app-state/resolve/page-content/block/image-strip/image-strip.resolve.app-state";

import { appStateResolveArticleSectionHeadingBlock } from "@app-state/resolve/page-content/block/article-section/article-section.resolve.app-state";

jest.mock(
  "@app-state/resolve/page-content/block/article-section/article-section.resolve.app-state",
  () => ({
    appStateResolveArticleSectionHeadingBlock: jest.fn(),
  }),
);

describe("appStateResolveImageStripBlock", () => {
  const mockedAppStateResolveArticleSectionHeadingBlock = jest.mocked(
    appStateResolveArticleSectionHeadingBlock,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("applies deterministic defaults", () => {
    const resolvedHeading = {
      text: "Strip Heading",
      level: 2,
      visuallyHidden: false,
    };

    mockedAppStateResolveArticleSectionHeadingBlock.mockReturnValue(
      resolvedHeading as never,
    );

    expect(
      appStateResolveImageStripBlock({
        kind: "imageStrip",
        heading: {
          text: "Strip Heading",
          level: 2,
        },
        source: "homepage-strip",
      } as never),
    ).toEqual({
      kind: "imageStrip",
      heading: resolvedHeading,
      source: "homepage-strip",
      flow: "breakout",
      strategy: "dailyRandom",
      itemCount: 5,
      excludePagePhotos: true,
    });

    expect(
      mockedAppStateResolveArticleSectionHeadingBlock,
    ).toHaveBeenCalledWith({
      text: "Strip Heading",
      level: 2,
    });
  });

  it("preserves authored values", () => {
    const resolvedHeading = {
      text: "Strip Heading",
      level: 3,
      visuallyHidden: true,
    };

    mockedAppStateResolveArticleSectionHeadingBlock.mockReturnValue(
      resolvedHeading as never,
    );

    expect(
      appStateResolveImageStripBlock({
        kind: "imageStrip",
        heading: {
          text: "Strip Heading",
          level: 3,
          visuallyHidden: true,
        },
        source: "homepage-strip",
        flow: "content",
        strategy: "dailyRandom",
        itemCount: 8,
        excludePagePhotos: false,
      } as never),
    ).toEqual({
      kind: "imageStrip",
      heading: resolvedHeading,
      source: "homepage-strip",
      flow: "content",
      strategy: "dailyRandom",
      itemCount: 8,
      excludePagePhotos: false,
    });
  });
});
