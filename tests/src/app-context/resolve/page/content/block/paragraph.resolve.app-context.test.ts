// tests/src/app-context/resolve/page/content/block/paragraph.resolve.app-context.test.ts

import { appContextResolveParagraphBlockContentModule } from "@app-context/resolve/page/content/block/paragraph.resolve.app-context";
import { appContextResolveInlineContent } from "@app-context/resolve/page/content/inline/inline.page-content.resolve.app-context";

jest.mock(
  "@app-context/resolve/page/content/inline/inline.page-content.resolve.app-context",
  () => ({
    appContextResolveInlineContent: jest.fn(),
  }),
);

describe("appContextResolveParagraphBlockContentModule", () => {
  const mockedAppContextResolveInlineContent = jest.mocked(
    appContextResolveInlineContent,
  );

  const context = {} as never;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves each inline content item in the paragraph", () => {
    mockedAppContextResolveInlineContent
      .mockReturnValueOnce({
        kind: "text",
        value: "Resolved text",
      })
      .mockReturnValueOnce({
        kind: "lineBreak",
      });

    const module = {
      kind: "paragraph",
      flow: "content",
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

    const result = appContextResolveParagraphBlockContentModule(
      module,
      context,
    );

    expect(result).toEqual({
      kind: "paragraph",
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
    expect(mockedAppContextResolveInlineContent).toHaveBeenNthCalledWith(
      1,
      module.content[0],
      context,
    );
    expect(mockedAppContextResolveInlineContent).toHaveBeenNthCalledWith(
      2,
      module.content[1],
      context,
    );
  });
});
