// tests/src/app-context/resolve/page/content/block/list.resolve.app-context.test.ts

import { appContextResolveListBlockContentModule } from "@app-context/resolve/page/content/block/list.resolve.app-context";
import { appContextResolveInlineContent } from "@app-context/resolve/page/content/inline/inline.page-content.resolve.app-context";

jest.mock(
  "@app-context/resolve/page/content/inline/inline.page-content.resolve.app-context",
  () => ({
    appContextResolveInlineContent: jest.fn(),
  }),
);

describe("appContextResolveListBlockContentModule", () => {
  const mockedAppContextResolveInlineContent = jest.mocked(
    appContextResolveInlineContent,
  );

  const context = {} as never;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves inline content for each list item", () => {
    mockedAppContextResolveInlineContent
      .mockReturnValueOnce({
        kind: "text",
        value: "First resolved item",
      })
      .mockReturnValueOnce({
        kind: "text",
        value: "Second resolved item",
      });

    const module = {
      kind: "list",
      style: "unordered",
      flow: "content",
      items: [
        {
          content: [
            {
              kind: "text",
              value: "First item",
            },
          ],
        },
        {
          content: [
            {
              kind: "text",
              value: "Second item",
            },
          ],
        },
      ],
    } as const;

    const result = appContextResolveListBlockContentModule(module, context);

    expect(result).toEqual({
      ...module,
      items: [
        {
          content: [
            {
              kind: "text",
              value: "First resolved item",
            },
          ],
        },
        {
          content: [
            {
              kind: "text",
              value: "Second resolved item",
            },
          ],
        },
      ],
    });

    expect(mockedAppContextResolveInlineContent).toHaveBeenCalledTimes(2);
  });
});
