// tests/src/app-state/resolve/page-content/inline/emphasis.resolve.app-state.test.ts

jest.mock(
  "@app-state/resolve/page-content/inline/inline.page-content.resolve.app-state",
  () => ({
    appStateResolveInlineContent: jest.fn(),
  }),
);

import { appStateResolveInlineContent } from "@app-state/resolve/page-content/inline/inline.page-content.resolve.app-state";
import { appStateResolveEmphasisInlineContent } from "@app-state/resolve/page-content/inline/emphasis.resolve.app-state";

import type { AuthoredEmphasisInlineContent } from "@shared-types/page-content/inline/emphasis/authored.emphasis.inline-content.page-content.types";
import type { AppStateEmphasisInlineContent } from "@shared-types/page-content/inline/emphasis/app-state.emphasis.inline-content.page-content.types";

const mockedAppStateResolveInlineContent =
  appStateResolveInlineContent as jest.MockedFunction<
    typeof appStateResolveInlineContent
  >;

describe("appStateResolveEmphasisInlineContent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("maps nested inline content through the shared inline resolver", () => {
    const firstInline = {
      kind: "text",
      value: "Hello",
    } as const;

    const secondInline = {
      kind: "code",
      value: "const answer = 42;",
    } as const;

    const authoredContent: AuthoredEmphasisInlineContent = {
      kind: "emphasis",
      content: [firstInline, secondInline],
    };

    const resolvedFirstInline = {
      kind: "text",
      value: "Resolved hello",
    } as const;

    const resolvedSecondInline = {
      kind: "code",
      value: "resolved code",
    } as const;

    mockedAppStateResolveInlineContent
      .mockReturnValueOnce(
        resolvedFirstInline as ReturnType<typeof appStateResolveInlineContent>,
      )
      .mockReturnValueOnce(
        resolvedSecondInline as ReturnType<typeof appStateResolveInlineContent>,
      );

    const result = appStateResolveEmphasisInlineContent(authoredContent);

    expect(mockedAppStateResolveInlineContent).toHaveBeenCalledTimes(2);
    expect(mockedAppStateResolveInlineContent.mock.calls[0]?.[0]).toBe(
      firstInline,
    );
    expect(mockedAppStateResolveInlineContent.mock.calls[1]?.[0]).toBe(
      secondInline,
    );

    const expected: AppStateEmphasisInlineContent = {
      kind: "emphasis",
      content: [resolvedFirstInline, resolvedSecondInline],
    };

    expect(result).toEqual(expected);
  });

  it("preserves nested content ordering after resolution", () => {
    const firstInline = {
      kind: "text",
      value: "First",
    } as const;

    const secondInline = {
      kind: "text",
      value: "Second",
    } as const;

    const authoredContent: AuthoredEmphasisInlineContent = {
      kind: "emphasis",
      content: [firstInline, secondInline],
    };

    mockedAppStateResolveInlineContent
      .mockReturnValueOnce({ kind: "text", value: "Resolved first" } as never)
      .mockReturnValueOnce({ kind: "text", value: "Resolved second" } as never);

    const result = appStateResolveEmphasisInlineContent(authoredContent);

    expect(result.content).toEqual([
      { kind: "text", value: "Resolved first" },
      { kind: "text", value: "Resolved second" },
    ]);
  });

  it("returns a new emphasis object", () => {
    const authoredContent: AuthoredEmphasisInlineContent = {
      kind: "emphasis",
      content: [],
    };

    const result = appStateResolveEmphasisInlineContent(authoredContent);

    expect(result).not.toBe(authoredContent);
    expect(result).toEqual({
      kind: "emphasis",
      content: [],
    });
  });

  it("returns an empty content array unchanged when there are no nested items", () => {
    const authoredContent: AuthoredEmphasisInlineContent = {
      kind: "emphasis",
      content: [],
    };

    const result = appStateResolveEmphasisInlineContent(authoredContent);

    expect(mockedAppStateResolveInlineContent).not.toHaveBeenCalled();
    expect(result).toEqual({
      kind: "emphasis",
      content: [],
    });
  });
});
