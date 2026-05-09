// src/app-context/resolve/page-content/block/list.resolve.app-context.test.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppStateListBlock } from "@shared-types/page-content/block/list/app-state.list.block.types";

import { appContextResolveListBlock } from "@app-context/resolve/page-content/block/list.resolve.app-context";

import { appContextResolveInline } from "@app-context/resolve/page-content/inline/inline.resolve.app-context";

jest.mock(
  "@app-context/resolve/page-content/inline/inline.resolve.app-context",
  () => ({
    appContextResolveInline: jest.fn(),
  }),
);

describe("appContextResolveListBlock", () => {
  const mockedAppContextResolveInline = jest.mocked(appContextResolveInline);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves inline content in list items", () => {
    const context = {} as AppContextPageContentResolverContext;

    const block: AppStateListBlock = {
      kind: "list",
      flow: "content",
      style: "unordered",
      items: [
        {
          content: [
            {
              kind: "text",
              value: "First item",
            },
          ],
        },
      ],
    };

    mockedAppContextResolveInline.mockReturnValue({
      kind: "text",
      value: "First item",
    });

    const result = appContextResolveListBlock(block, context);

    expect(result).toEqual({
      kind: "list",
      flow: "content",
      style: "unordered",
      items: [
        {
          content: [
            {
              kind: "text",
              value: "First item",
            },
          ],
        },
      ],
    });

    expect(mockedAppContextResolveInline).toHaveBeenCalledTimes(1);
    expect(mockedAppContextResolveInline).toHaveBeenCalledWith(
      block.items[0].content[0],
      context,
    );
  });

  it("preserves empty list items", () => {
    const context = {} as AppContextPageContentResolverContext;

    const block: AppStateListBlock = {
      kind: "list",
      flow: "content",
      style: "unordered",
      items: [
        {
          content: [],
        },
      ],
    };

    const result = appContextResolveListBlock(block, context);

    expect(result).toEqual({
      kind: "list",
      flow: "content",
      style: "unordered",
      items: [
        {
          content: [],
        },
      ],
    });

    expect(mockedAppContextResolveInline).not.toHaveBeenCalled();
  });
});
