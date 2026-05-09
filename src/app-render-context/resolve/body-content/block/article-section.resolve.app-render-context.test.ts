// src/app-render-context/resolve/body-content/block/article-section.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";
import type {
  AppContextArticleSectionBlock,
  AppContextArticleSectionHeadingBlock,
} from "@shared-types/page-content/block/article-section/app-context.article-section.block.types";
import type { AppContextParagraphBlock } from "@shared-types/page-content/block/paragraph/app-context.paragraph.block.types";

import {
  appRenderContextResolveArticleSectionBlock,
  appRenderContextResolveArticleSectionHeadingBlock,
} from "@app-render-context/resolve/body-content/block/article-section.resolve.app-render-context";
import { appRenderContextResolveBlock } from "@app-render-context/resolve/body-content/block/block.resolve.app-render-context";

jest.mock(
  "@app-render-context/resolve/body-content/block/block.resolve.app-render-context",
  () => ({
    appRenderContextResolveBlock: jest.fn(),
  }),
);

describe("appRenderContextResolveArticleSectionHeadingBlock", () => {
  it("returns the heading unchanged", () => {
    const heading: AppContextArticleSectionHeadingBlock = {
      text: "Field Notes",
      level: 2,
      visuallyHidden: false,
    };

    expect(appRenderContextResolveArticleSectionHeadingBlock(heading)).toEqual(
      heading,
    );
  });

  it("preserves visually hidden heading state", () => {
    const heading: AppContextArticleSectionHeadingBlock = {
      text: "Screen-reader section heading",
      visuallyHidden: true,
      level: 2,
    };

    expect(appRenderContextResolveArticleSectionHeadingBlock(heading)).toEqual(
      heading,
    );
  });
});

describe("appRenderContextResolveArticleSectionBlock", () => {
  const mockedAppRenderContextResolveBlock = jest.mocked(
    appRenderContextResolveBlock,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves child blocks", () => {
    const childBlock: AppContextParagraphBlock = {
      kind: "paragraph",
      flow: "content",
      content: [],
    };

    const resolvedChildBlock = {
      kind: "paragraph",
      flow: "content",
      content: [],
    };

    mockedAppRenderContextResolveBlock.mockReturnValue(
      resolvedChildBlock as never,
    );

    const block: AppContextArticleSectionBlock = {
      kind: "articleSection",
      heading: {
        text: "Wildlife",
        level: 2,
        visuallyHidden: false,
      },
      modules: [childBlock],
    };

    const appContext = {} as AppContext;

    const result = appRenderContextResolveArticleSectionBlock(
      appContext,
      block,
    );

    expect(result).toEqual({
      ...block,
      modules: [resolvedChildBlock],
    });

    expect(mockedAppRenderContextResolveBlock).toHaveBeenCalledTimes(1);
    expect(mockedAppRenderContextResolveBlock).toHaveBeenCalledWith(
      appContext,
      childBlock,
    );
  });

  it("returns an empty modules array when no child blocks exist", () => {
    const block: AppContextArticleSectionBlock = {
      kind: "articleSection",
      heading: {
        text: "Empty Section",
        level: 2,
        visuallyHidden: false,
      },
      modules: [],
    };

    const appContext = {} as AppContext;

    const result = appRenderContextResolveArticleSectionBlock(
      appContext,
      block,
    );

    expect(result).toEqual({
      ...block,
      modules: [],
    });

    expect(mockedAppRenderContextResolveBlock).not.toHaveBeenCalled();
  });
});
