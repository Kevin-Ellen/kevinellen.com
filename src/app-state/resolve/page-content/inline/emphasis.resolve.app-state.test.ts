// src/app-state/resolve/page-content/inline/emphasis.resolve.app-state.test.ts

import { appStateResolveEmphasisInline } from "@app-state/resolve/page-content/inline/emphasis.resolve.app-state";

import { appStateResolveInline } from "@app-state/resolve/page-content/inline/inline.page-content.resolve.app-state";

jest.mock(
  "@app-state/resolve/page-content/inline/inline.page-content.resolve.app-state",
  () => ({
    appStateResolveInline: jest.fn(),
  }),
);

describe("appStateResolveEmphasisInline", () => {
  const mockedAppStateResolveInline = jest.mocked(appStateResolveInline);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves nested inline content", () => {
    const inline = {
      kind: "text",
      value: "Important",
    };

    const resolvedInline = {
      kind: "text",
      value: "Resolved Important",
    };

    mockedAppStateResolveInline.mockReturnValue(resolvedInline as never);

    expect(
      appStateResolveEmphasisInline({
        kind: "emphasis",
        content: [inline],
      } as never),
    ).toEqual({
      kind: "emphasis",
      content: [resolvedInline],
    });

    expect(mockedAppStateResolveInline).toHaveBeenCalledWith(inline, 0, [
      inline,
    ]);
  });
});
