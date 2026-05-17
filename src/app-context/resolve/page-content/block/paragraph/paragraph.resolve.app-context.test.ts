// src/app-context/resolve/page-content/block/paragraph/paragraph.resolve.app-context.test.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppStateParagraphBlock } from "@shared-types/page-content/block/paragraph/app-state.paragraph.block.types";

import { appContextResolveParagraphBlock } from "@app-context/resolve/page-content/block/paragraph/paragraph.resolve.app-context";

import { appContextResolveInline } from "@app-context/resolve/page-content/inline/inline.resolve.app-context";

jest.mock(
  "@app-context/resolve/page-content/inline/inline.resolve.app-context",
  () => ({
    appContextResolveInline: jest.fn(),
  }),
);

describe("appContextResolveParagraphBlock", () => {
  const mockedAppContextResolveInline = jest.mocked(appContextResolveInline);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves inline paragraph content", () => {
    const context = {} as AppContextPageContentResolverContext;

    const block: AppStateParagraphBlock = {
      kind: "paragraph",
      flow: "content",
      content: [
        {
          kind: "text",
          value: "Hello world",
        },
      ],
    };

    mockedAppContextResolveInline.mockReturnValue({
      kind: "text",
      value: "Hello world",
    });

    const result = appContextResolveParagraphBlock(block, context);

    expect(result).toEqual({
      kind: "paragraph",
      flow: "content",
      content: [
        {
          kind: "text",
          value: "Hello world",
        },
      ],
    });

    expect(mockedAppContextResolveInline).toHaveBeenCalledTimes(1);

    expect(mockedAppContextResolveInline).toHaveBeenCalledWith(
      block.content[0],
      context,
    );
  });

  it("preserves empty paragraph content", () => {
    const context = {} as AppContextPageContentResolverContext;

    const block: AppStateParagraphBlock = {
      kind: "paragraph",
      flow: "content",
      content: [],
    };

    const result = appContextResolveParagraphBlock(block, context);

    expect(result).toEqual({
      kind: "paragraph",
      flow: "content",
      content: [],
    });

    expect(mockedAppContextResolveInline).not.toHaveBeenCalled();
  });
});
