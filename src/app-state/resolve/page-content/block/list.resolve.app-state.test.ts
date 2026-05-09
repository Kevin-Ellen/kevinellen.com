// src/app-state/resolve/page-content/block/list.resolve.app-state.test.ts

import {
  appStateResolveListBlock,
  appStateResolveListItemBlock,
} from "@app-state/resolve/page-content/block/list.resolve.app-state";

import { appStateResolveInline } from "@app-state/resolve/page-content/inline/inline.page-content.resolve.app-state";

jest.mock(
  "@app-state/resolve/page-content/inline/inline.page-content.resolve.app-state",
  () => ({
    appStateResolveInline: jest.fn(),
  }),
);

describe("list.resolve.app-state", () => {
  const mockedAppStateResolveInline = jest.mocked(appStateResolveInline);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves list item inline content", () => {
    const inline = {
      kind: "text",
      value: "List item",
    };

    const resolvedInline = {
      kind: "text",
      value: "Resolved list item",
    };

    mockedAppStateResolveInline.mockReturnValue(resolvedInline as never);

    expect(
      appStateResolveListItemBlock({
        content: [inline],
      } as never),
    ).toEqual({
      content: [resolvedInline],
    });

    expect(mockedAppStateResolveInline).toHaveBeenCalledWith(inline, 0, [
      inline,
    ]);
  });

  it("applies deterministic list defaults", () => {
    expect(
      appStateResolveListBlock({
        kind: "list",
        items: [],
      }),
    ).toEqual({
      kind: "list",
      flow: "content",
      style: "unordered",
      items: [],
    });
  });

  it("preserves authored list values and resolves items", () => {
    const inline = {
      kind: "text",
      value: "Ordered item",
    };

    const resolvedInline = {
      kind: "text",
      value: "Resolved ordered item",
    };

    mockedAppStateResolveInline.mockReturnValue(resolvedInline as never);

    expect(
      appStateResolveListBlock({
        kind: "list",
        flow: "breakout",
        style: "ordered",
        items: [
          {
            content: [inline],
          },
        ],
      } as never),
    ).toEqual({
      kind: "list",
      flow: "breakout",
      style: "ordered",
      items: [
        {
          content: [resolvedInline],
        },
      ],
    });

    expect(mockedAppStateResolveInline).toHaveBeenCalledWith(inline, 0, [
      inline,
    ]);
  });
});
