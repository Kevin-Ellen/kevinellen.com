// src/app-state/resolve/page-content/block/paragraph/paragraph.resolve.app-state.test.ts

import { appStateResolveParagraphBlock } from "@app-state/resolve/page-content/block/paragraph/paragraph.resolve.app-state";

import { appStateResolveInline } from "@app-state/resolve/page-content/inline/inline.page-content.resolve.app-state";

jest.mock(
  "@app-state/resolve/page-content/inline/inline.page-content.resolve.app-state",
  () => ({
    appStateResolveInline: jest.fn(),
  }),
);

describe("appStateResolveParagraphBlock", () => {
  const mockedAppStateResolveInline = jest.mocked(appStateResolveInline);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("applies deterministic defaults", () => {
    expect(
      appStateResolveParagraphBlock({
        kind: "paragraph",
        content: [],
      }),
    ).toEqual({
      kind: "paragraph",
      flow: "content",
      content: [],
    });
  });

  it("resolves inline content", () => {
    const inline = {
      kind: "text",
      value: "Paragraph content",
    };

    const resolvedInline = {
      kind: "text",
      value: "Resolved paragraph content",
    };

    mockedAppStateResolveInline.mockReturnValue(resolvedInline as never);

    expect(
      appStateResolveParagraphBlock({
        kind: "paragraph",
        flow: "breakout",
        content: [inline],
      } as never),
    ).toEqual({
      kind: "paragraph",
      flow: "breakout",
      content: [resolvedInline],
    });

    expect(mockedAppStateResolveInline).toHaveBeenCalledWith(inline, 0, [
      inline,
    ]);
  });
});
