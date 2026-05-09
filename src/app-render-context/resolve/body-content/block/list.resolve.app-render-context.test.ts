// src/app-render-context/resolve/body-content/block/list.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextListBlock } from "@shared-types/page-content/block/list/app-context.list.block.types";

import { appRenderContextResolveListBlock } from "@app-render-context/resolve/body-content/block/list.resolve.app-render-context";
import { appRenderContextResolveInline } from "@app-render-context/resolve/body-content/inline/inline.resolve.app-render-context";

jest.mock(
  "@app-render-context/resolve/body-content/inline/inline.resolve.app-render-context",
  () => ({
    appRenderContextResolveInline: jest.fn(),
  }),
);

describe("appRenderContextResolveListBlock", () => {
  const mockedAppRenderContextResolveInline = jest.mocked(
    appRenderContextResolveInline,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves inline content for each list item", () => {
    const inlineItem = {
      kind: "text",
      text: "First item",
    };

    const resolvedInlineItem = {
      kind: "text",
      text: "First item",
    };

    mockedAppRenderContextResolveInline.mockReturnValue(
      resolvedInlineItem as never,
    );

    const block: AppContextListBlock = {
      kind: "list",
      flow: "content",
      style: "unordered",
      items: [
        {
          content: [inlineItem as never],
        },
      ],
    };

    const appContext = {} as unknown as AppContext;

    expect(appRenderContextResolveListBlock(appContext, block)).toEqual({
      ...block,
      items: [
        {
          content: [resolvedInlineItem],
        },
      ],
    });

    expect(mockedAppRenderContextResolveInline).toHaveBeenCalledTimes(1);
    expect(mockedAppRenderContextResolveInline).toHaveBeenCalledWith(
      appContext,
      inlineItem,
    );
  });

  it("preserves empty list items and does not resolve inline content", () => {
    const block: AppContextListBlock = {
      kind: "list",
      flow: "content",
      style: "unordered",
      items: [
        {
          content: [],
        },
      ],
    };

    expect(
      appRenderContextResolveListBlock({} as unknown as AppContext, block),
    ).toEqual(block);

    expect(mockedAppRenderContextResolveInline).not.toHaveBeenCalled();
  });

  it("preserves an empty items array", () => {
    const block: AppContextListBlock = {
      kind: "list",
      flow: "content",
      style: "unordered",
      items: [],
    };

    expect(
      appRenderContextResolveListBlock({} as unknown as AppContext, block),
    ).toEqual(block);

    expect(mockedAppRenderContextResolveInline).not.toHaveBeenCalled();
  });
});
