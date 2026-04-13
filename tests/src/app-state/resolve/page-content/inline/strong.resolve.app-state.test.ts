// tests/src/app-state/resolve/page-content/inline/strong.resolve.app-state.test.ts

jest.mock(
  "@app-state/resolve/page-content/inline/inline.page-content.resolve.app-state",
  () => ({
    appStateResolveInlineContent: jest.fn(),
  }),
);

import { appStateResolveInlineContent } from "@app-state/resolve/page-content/inline/inline.page-content.resolve.app-state";
import { appStateResolveStrongInlineContent } from "@app-state/resolve/page-content/inline/strong.resolve.app-state";

import type { AuthoredStrongInlineContent } from "@shared-types/page-content/inline/strong/authored.strong.inline-content.page-content.types";
import type { AppStateStrongInlineContent } from "@shared-types/page-content/inline/strong/app-state.strong.inline-content.page-content.types";

const mockedAppStateResolveInlineContent =
  appStateResolveInlineContent as jest.MockedFunction<
    typeof appStateResolveInlineContent
  >;

describe("appStateResolveStrongInlineContent", () => {
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

    const authoredContent: AuthoredStrongInlineContent = {
      kind: "strong",
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

    const result = appStateResolveStrongInlineContent(authoredContent);

    expect(mockedAppStateResolveInlineContent).toHaveBeenCalledTimes(2);
    expect(mockedAppStateResolveInlineContent.mock.calls[0]?.[0]).toBe(
      firstInline,
    );
    expect(mockedAppStateResolveInlineContent.mock.calls[1]?.[0]).toBe(
      secondInline,
    );

    const expected: AppStateStrongInlineContent = {
      kind: "strong",
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

    const authoredContent: AuthoredStrongInlineContent = {
      kind: "strong",
      content: [firstInline, secondInline],
    };

    const resolvedFirst = {
      kind: "text",
      value: "Resolved first",
    } as const;

    const resolvedSecond = {
      kind: "text",
      value: "Resolved second",
    } as const;

    mockedAppStateResolveInlineContent
      .mockReturnValueOnce(
        resolvedFirst as ReturnType<typeof appStateResolveInlineContent>,
      )
      .mockReturnValueOnce(
        resolvedSecond as ReturnType<typeof appStateResolveInlineContent>,
      );

    const result = appStateResolveStrongInlineContent(authoredContent);

    expect(result.content).toEqual([resolvedFirst, resolvedSecond]);
  });

  it("returns a new strong wrapper object", () => {
    const authoredContent: AuthoredStrongInlineContent = {
      kind: "strong",
      content: [],
    };

    const result = appStateResolveStrongInlineContent(authoredContent);

    expect(result).not.toBe(authoredContent);
    expect(result).toEqual({
      kind: "strong",
      content: [],
    });
  });

  it("returns an empty content array unchanged when there are no nested items", () => {
    const authoredContent: AuthoredStrongInlineContent = {
      kind: "strong",
      content: [],
    };

    const result = appStateResolveStrongInlineContent(authoredContent);

    expect(mockedAppStateResolveInlineContent).not.toHaveBeenCalled();
    expect(result).toEqual({
      kind: "strong",
      content: [],
    });
  });
});
