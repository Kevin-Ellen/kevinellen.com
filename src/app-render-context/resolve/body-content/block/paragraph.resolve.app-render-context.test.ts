// src/app-render-context/resolve/body-content/block/paragraph.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextParagraphBlock } from "@shared-types/page-content/block/paragraph/app-context.paragraph.block.types";

import { appRenderContextResolveParagraphBlock } from "@app-render-context/resolve/body-content/block/paragraph.resolve.app-render-context";
import { appRenderContextResolveInline } from "@app-render-context/resolve/body-content/inline/inline.resolve.app-render-context";

jest.mock(
  "@app-render-context/resolve/body-content/inline/inline.resolve.app-render-context",
  () => ({
    appRenderContextResolveInline: jest.fn(),
  }),
);

describe("appRenderContextResolveParagraphBlock", () => {
  const mockedAppRenderContextResolveInline = jest.mocked(
    appRenderContextResolveInline,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves inline paragraph content", () => {
    const inlineItem = {
      kind: "text",
      text: "A coot drifts through reeds.",
    };

    const resolvedInlineItem = {
      kind: "text",
      text: "A coot drifts through reeds.",
    };

    mockedAppRenderContextResolveInline.mockReturnValue(
      resolvedInlineItem as never,
    );

    const block: AppContextParagraphBlock = {
      kind: "paragraph",
      flow: "content",
      content: [inlineItem as never],
    };

    const appContext = {} as unknown as AppContext;

    expect(appRenderContextResolveParagraphBlock(appContext, block)).toEqual({
      ...block,
      content: [resolvedInlineItem],
    });

    expect(mockedAppRenderContextResolveInline).toHaveBeenCalledTimes(1);
    expect(mockedAppRenderContextResolveInline).toHaveBeenCalledWith(
      appContext,
      inlineItem,
    );
  });

  it("returns an empty content array when no inline content exists", () => {
    const block: AppContextParagraphBlock = {
      kind: "paragraph",
      flow: "content",
      content: [],
    };

    expect(
      appRenderContextResolveParagraphBlock({} as unknown as AppContext, block),
    ).toEqual(block);

    expect(mockedAppRenderContextResolveInline).not.toHaveBeenCalled();
  });
});
