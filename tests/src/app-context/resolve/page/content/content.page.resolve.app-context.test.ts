// tests/src/app-context/resolve/page/content/content.page.resolve.app-context.test.ts

import { appContextResolvePageContent } from "@app-context/resolve/page/content/content.page.resolve.app-context";
import { appContextResolvePageContentHead } from "@app-context/resolve/page/content/head/content-head.page.resolve.app-context";
import { appContextResolveBlockContentModule } from "@app-context/resolve/page/content/block/block.page-content.resolve.app-context";

jest.mock(
  "@app-context/resolve/page/content/head/content-head.page.resolve.app-context",
  () => ({
    appContextResolvePageContentHead: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page/content/block/block.page-content.resolve.app-context",
  () => ({
    appContextResolveBlockContentModule: jest.fn(),
  }),
);

describe("appContextResolvePageContent", () => {
  const mockedAppContextResolvePageContentHead = jest.mocked(
    appContextResolvePageContentHead,
  );
  const mockedAppContextResolveBlockContentModule = jest.mocked(
    appContextResolveBlockContentModule,
  );

  const context = {} as never;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves head, body, and footer content", () => {
    const content = {
      head: {
        title: "About",
        eyebrow: null,
        intro: null,
      },
      body: [
        {
          kind: "paragraph",
          content: [],
        },
        {
          kind: "quote",
          id: "quote-1",
          text: "Quote",
          attribution: "Author",
        },
      ],
      footer: [
        {
          kind: "pre",
          value: "const x = 1;",
        },
      ],
    } as const;

    mockedAppContextResolvePageContentHead.mockReturnValue({
      title: "Resolved About",
      eyebrow: "Resolved eyebrow",
      intro: "Resolved intro",
    });

    mockedAppContextResolveBlockContentModule
      .mockReturnValueOnce({
        kind: "paragraph",
        content: [
          {
            kind: "text",
            value: "Resolved paragraph",
          },
        ],
      })
      .mockReturnValueOnce({
        kind: "quote",
        id: "quote-1",
        text: "Resolved quote",
        attribution: "Author",
      })
      .mockReturnValueOnce({
        kind: "pre",
        value: "resolved pre block",
      });

    const result = appContextResolvePageContent(content, context);

    expect(result).toEqual({
      head: {
        title: "Resolved About",
        eyebrow: "Resolved eyebrow",
        intro: "Resolved intro",
      },
      body: [
        {
          kind: "paragraph",
          content: [
            {
              kind: "text",
              value: "Resolved paragraph",
            },
          ],
        },
        {
          kind: "quote",
          id: "quote-1",
          text: "Resolved quote",
          attribution: "Author",
        },
      ],
      footer: [
        {
          kind: "pre",
          value: "resolved pre block",
        },
      ],
    });

    expect(mockedAppContextResolvePageContentHead).toHaveBeenCalledWith(
      content.head,
      context,
    );

    expect(mockedAppContextResolveBlockContentModule).toHaveBeenCalledTimes(3);
    expect(mockedAppContextResolveBlockContentModule).toHaveBeenNthCalledWith(
      1,
      content.body[0],
      context,
    );
    expect(mockedAppContextResolveBlockContentModule).toHaveBeenNthCalledWith(
      2,
      content.body[1],
      context,
    );
    expect(mockedAppContextResolveBlockContentModule).toHaveBeenNthCalledWith(
      3,
      content.footer[0],
      context,
    );
  });

  it("resolves empty body and footer arrays", () => {
    const content = {
      head: {
        title: "Home",
        eyebrow: null,
        intro: null,
      },
      body: [],
      footer: [],
    } as const;

    mockedAppContextResolvePageContentHead.mockReturnValue(content.head);

    const result = appContextResolvePageContent(content, context);

    expect(result).toEqual({
      head: content.head,
      body: [],
      footer: [],
    });

    expect(mockedAppContextResolvePageContentHead).toHaveBeenCalledWith(
      content.head,
      context,
    );
    expect(mockedAppContextResolveBlockContentModule).not.toHaveBeenCalled();
  });
});
