// tests/src/app-state/resolve/page-content/block/paragraph.resolve.app-state.test.ts

jest.mock(
  "@app-state/resolve/page-content/inline/inline.page-content.resolve.app-state",
  () => ({
    appStateResolveInlineContent: jest.fn(),
  }),
);

import { appStateResolveInlineContent } from "@app-state/resolve/page-content/inline/inline.page-content.resolve.app-state";
import { appStateResolveParagraphBlockContentModule } from "@app-state/resolve/page-content/block/paragraph.resolve.app-state";

import type { AuthoredParagraphBlockContentModule } from "@shared-types/page-content/block/paragraph/authored.paragraph.block.page-content.types";
import type { AppStateParagraphBlockContentModule } from "@shared-types/page-content/block/paragraph/app-state.paragraph.block.page-content.types";

const mockedAppStateResolveInlineContent =
  appStateResolveInlineContent as jest.MockedFunction<
    typeof appStateResolveInlineContent
  >;

describe("appStateResolveParagraphBlockContentModule", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("maps paragraph inline content through the shared inline resolver", () => {
    const firstInline = {
      kind: "text",
      value: "Hello",
    } as const;

    const secondInline = {
      kind: "code",
      value: "const answer = 42;",
    } as const;

    const module: AuthoredParagraphBlockContentModule = {
      kind: "paragraph",
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

    const result = appStateResolveParagraphBlockContentModule(module);

    expect(mockedAppStateResolveInlineContent).toHaveBeenCalledTimes(2);
    expect(mockedAppStateResolveInlineContent.mock.calls[0]?.[0]).toBe(
      firstInline,
    );
    expect(mockedAppStateResolveInlineContent.mock.calls[1]?.[0]).toBe(
      secondInline,
    );

    const expected: AppStateParagraphBlockContentModule = {
      kind: "paragraph",
      flow: "content",
      content: [resolvedFirstInline, resolvedSecondInline],
    };

    expect(result).toEqual(expected);
  });

  it("preserves inline content ordering after resolution", () => {
    const firstInline = {
      kind: "text",
      value: "First",
    } as const;

    const secondInline = {
      kind: "text",
      value: "Second",
    } as const;

    const module: AuthoredParagraphBlockContentModule = {
      kind: "paragraph",
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

    const result = appStateResolveParagraphBlockContentModule(module);

    expect(result.content).toEqual([resolvedFirst, resolvedSecond]);
  });

  it("returns an empty content array unchanged when the paragraph has no inline content", () => {
    const module: AuthoredParagraphBlockContentModule = {
      kind: "paragraph",
      content: [],
    };

    const result = appStateResolveParagraphBlockContentModule(module);

    expect(mockedAppStateResolveInlineContent).not.toHaveBeenCalled();
    expect(result).toEqual({
      kind: "paragraph",
      flow: "content",
      content: [],
    });
  });

  it("returns the expected AppState paragraph shape", () => {
    const inline = {
      kind: "text",
      value: "Only item",
    } as const;

    const module: AuthoredParagraphBlockContentModule = {
      kind: "paragraph",
      content: [inline],
    };

    const resolvedInline = {
      kind: "text",
      value: "Resolved only item",
    } as const;

    mockedAppStateResolveInlineContent.mockReturnValue(
      resolvedInline as ReturnType<typeof appStateResolveInlineContent>,
    );

    const result = appStateResolveParagraphBlockContentModule(module);

    const expected: AppStateParagraphBlockContentModule = {
      kind: "paragraph",
      flow: "content",
      content: [resolvedInline],
    };

    expect(result).toEqual(expected);
  });
});
