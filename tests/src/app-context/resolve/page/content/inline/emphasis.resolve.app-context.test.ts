// tests/src/app-context/resolve/page/content/inline/emphasis.resolve.app-context.test.ts

import { appContextResolveEmphasisInlineContent } from "@app-context/resolve/page/content/inline/emphasis.resolve.app-context";
import { appContextResolveInlineContent } from "@app-context/resolve/page/content/inline/inline.page-content.resolve.app-context";

jest.mock(
  "@app-context/resolve/page/content/inline/inline.page-content.resolve.app-context",
  () => ({
    appContextResolveInlineContent: jest.fn(),
  }),
);

describe("appContextResolveEmphasisInlineContent", () => {
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
        kind: "code",
        value: "resolvedCode()",
      });

    const content = {
      kind: "emphasis",
      content: [
        {
          kind: "text",
          value: "Original text",
        },
        {
          kind: "code",
          value: "originalCode()",
        },
      ],
    } as const;

    const result = appContextResolveEmphasisInlineContent(content, context);

    expect(result).toEqual({
      kind: "emphasis",
      content: [
        {
          kind: "text",
          value: "Resolved text",
        },
        {
          kind: "code",
          value: "resolvedCode()",
        },
      ],
    });

    expect(mockedAppContextResolveInlineContent).toHaveBeenCalledTimes(2);
    expect(mockedAppContextResolveInlineContent).toHaveBeenNthCalledWith(
      1,
      content.content[0],
      context,
    );
    expect(mockedAppContextResolveInlineContent).toHaveBeenNthCalledWith(
      2,
      content.content[1],
      context,
    );
  });
});
