// src/app-context/resolve/page-content/block/article-section.resolve.app-context.test.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type {
  AppStateArticleSectionBlock,
  AppStateArticleSectionHeadingBlock,
} from "@shared-types/page-content/block/article-section/app-state.article-section.block.types";

import {
  appContextResolveArticleSectionBlock,
  appContextResolveArticleSectionHeadingBlock,
} from "@app-context/resolve/page-content/block/article-section.resolve.app-context";

import { appContextResolveBlock } from "@app-context/resolve/page-content/block/block.resolve.app-context";

jest.mock(
  "@app-context/resolve/page-content/block/block.resolve.app-context",
  () => ({
    appContextResolveBlock: jest.fn(),
  }),
);

describe("appContextResolveArticleSectionHeadingBlock", () => {
  it("returns the heading unchanged", () => {
    const context = {} as AppContextPageContentResolverContext;

    const heading: AppStateArticleSectionHeadingBlock = {
      text: "Field notes",
      level: 2,
      visuallyHidden: false,
    };

    const result = appContextResolveArticleSectionHeadingBlock(
      heading,
      context,
    );

    expect(result).toEqual(heading);
    expect(result).toBe(heading);
  });
});

describe("appContextResolveArticleSectionBlock", () => {
  const mockedAppContextResolveBlock = jest.mocked(appContextResolveBlock);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves nested block modules", () => {
    const context = {} as AppContextPageContentResolverContext;

    const block: AppStateArticleSectionBlock = {
      kind: "articleSection",
      heading: {
        text: "Field notes",
        level: 2,
        visuallyHidden: false,
      },
      modules: [
        {
          kind: "paragraph",
          flow: "content",
          content: [
            {
              kind: "text",
              value: "Nested paragraph",
            },
          ],
        },
      ],
    };

    mockedAppContextResolveBlock.mockReturnValue({
      kind: "paragraph",
      flow: "content",
      content: [
        {
          kind: "text",
          value: "Nested paragraph",
        },
      ],
    });

    const result = appContextResolveArticleSectionBlock(block, context);

    expect(result).toEqual({
      kind: "articleSection",
      heading: {
        text: "Field notes",
        level: 2,
        visuallyHidden: false,
      },
      modules: [
        {
          kind: "paragraph",
          flow: "content",
          content: [
            {
              kind: "text",
              value: "Nested paragraph",
            },
          ],
        },
      ],
    });

    expect(mockedAppContextResolveBlock).toHaveBeenCalledTimes(1);
    expect(mockedAppContextResolveBlock).toHaveBeenCalledWith(
      block.modules[0],
      context,
    );
  });

  it("preserves empty nested modules", () => {
    const context = {} as AppContextPageContentResolverContext;

    const block: AppStateArticleSectionBlock = {
      kind: "articleSection",
      heading: {
        text: "Field notes",
        level: 2,
        visuallyHidden: true,
      },
      modules: [],
    };

    const result = appContextResolveArticleSectionBlock(block, context);

    expect(result).toEqual({
      kind: "articleSection",
      heading: {
        text: "Field notes",
        level: 2,
        visuallyHidden: true,
      },
      modules: [],
    });

    expect(mockedAppContextResolveBlock).not.toHaveBeenCalled();
  });
});
