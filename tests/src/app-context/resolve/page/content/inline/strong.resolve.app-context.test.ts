// tests/src/app-context/resolve/page/content/inline/strong.resolve.app-context.test.ts

import { appContextResolveStrongInlineContent } from "@app-context/resolve/page/content/inline/strong.resolve.app-context";
import { appContextResolveInlineContent } from "@app-context/resolve/page/content/inline/inline.page-content.resolve.app-context";

jest.mock(
  "@app-context/resolve/page/content/inline/inline.page-content.resolve.app-context",
  () => ({
    appContextResolveInlineContent: jest.fn(),
  }),
);

describe("appContextResolveStrongInlineContent", () => {
  const mockedAppContextResolveInlineContent = jest.mocked(
    appContextResolveInlineContent,
  );

  const context = {} as never;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves nested inline content items", () => {
    mockedAppContextResolveInlineContent
      .mockReturnValueOnce({
        kind: "text",
        value: "Resolved text",
      })
      .mockReturnValueOnce({
        kind: "lineBreak",
      });

    const content = {
      kind: "strong",
      content: [
        {
          kind: "text",
          value: "Original text",
        },
        {
          kind: "lineBreak",
        },
      ],
    } as const;

    const result = appContextResolveStrongInlineContent(content, context);

    expect(result).toEqual({
      kind: "strong",
      content: [
        {
          kind: "text",
          value: "Resolved text",
        },
        {
          kind: "lineBreak",
        },
      ],
    });

    expect(mockedAppContextResolveInlineContent).toHaveBeenCalledTimes(2);
  });
});
