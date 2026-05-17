// src/app-state/resolve/page-content/inline/strong.resolve.app-state.test.ts

import { appStateResolveStrongInline } from "@app-state/resolve/page-content/inline/strong.resolve.app-state";

import { appStateResolveInline } from "@app-state/resolve/page-content/inline/inline.page-content.resolve.app-state";

jest.mock(
  "@app-state/resolve/page-content/inline/inline.page-content.resolve.app-state",
  () => ({
    appStateResolveInline: jest.fn(),
  }),
);

describe("appStateResolveStrongInline", () => {
  const mockedAppStateResolveInline = jest.mocked(appStateResolveInline);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves nested inline content", () => {
    const inline = {
      kind: "text",
      value: "Very important",
    };

    const resolvedInline = {
      kind: "text",
      value: "Resolved Very important",
    };

    mockedAppStateResolveInline.mockReturnValue(resolvedInline as never);

    expect(
      appStateResolveStrongInline({
        kind: "strong",
        content: [inline],
      } as never),
    ).toEqual({
      kind: "strong",
      content: [resolvedInline],
    });

    expect(mockedAppStateResolveInline).toHaveBeenCalledWith(inline, 0, [
      inline,
    ]);
  });
});
