// tests/src/app-context/resolve/page/content/content.page.resolve.app-context.test.ts

import { appContextResolvePageContent } from "@app-context/resolve/page/content/content.page.resolve.app-context";
import { appContextResolvePageContentHead } from "@app-context/resolve/page/content/head/content-head.page.resolve.app-context";
import { appContextResolveBlockContentModule } from "@app-context/resolve/page/content/block/block.page-content.resolve.app-context";
import { appContextResolveFooterContentModule } from "@app-context/resolve/page/content/footer/footer.page-content.resolve.app-context";

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

jest.mock(
  "@app-context/resolve/page/content/footer/footer.page-content.resolve.app-context",
  () => ({
    appContextResolveFooterContentModule: jest.fn(),
  }),
);

describe("appContextResolvePageContent", () => {
  const mockedAppContextResolvePageContentHead = jest.mocked(
    appContextResolvePageContentHead,
  );
  const mockedAppContextResolveBlockContentModule = jest.mocked(
    appContextResolveBlockContentModule,
  );
  const mockedAppContextResolveFooterContentModule = jest.mocked(
    appContextResolveFooterContentModule,
  );

  const context = {} as never;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves header, content, and footer content", () => {
    const content = {
      header: {
        title: "About",
        eyebrow: null,
        intro: null,
      },
      content: [
        {
          kind: "paragraph",
          flow: "content",
          content: [],
        },
        {
          kind: "quote",
          id: "quote-1",
          text: "Quote",
          attribution: "Author",
          flow: "content",
        },
      ],
      footer: [
        {
          kind: "journalEntryFooter",
          publication: {
            author: "Kevin Ellen",
            publishedAt: "2025-05-27T10:30:00.000Z",
            updatedAt: [],
          },
          tags: [],
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
        flow: "content",
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
        flow: "content",
      });

    mockedAppContextResolveFooterContentModule.mockReturnValueOnce({
      kind: "journalEntryFooter",
      publication: {
        author: "Kevin Ellen",
        publishedAt: "2025-05-27T10:30:00.000Z",
        updatedAt: [],
      },
      tags: [],
      equipment: {
        cameras: [],
        lenses: [],
      },
    } as never);

    const result = appContextResolvePageContent(content, context);

    expect(result).toEqual({
      header: {
        title: "Resolved About",
        eyebrow: "Resolved eyebrow",
        intro: "Resolved intro",
      },
      content: [
        {
          kind: "paragraph",
          flow: "content",
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
          flow: "content",
        },
      ],
      footer: [
        {
          kind: "journalEntryFooter",
          publication: {
            author: "Kevin Ellen",
            publishedAt: "2025-05-27T10:30:00.000Z",
            updatedAt: [],
          },
          tags: [],
          equipment: {
            cameras: [],
            lenses: [],
          },
        },
      ],
    });

    expect(mockedAppContextResolvePageContentHead).toHaveBeenCalledWith(
      content.header,
      context,
    );

    expect(mockedAppContextResolveBlockContentModule).toHaveBeenCalledTimes(2);
    expect(mockedAppContextResolveBlockContentModule).toHaveBeenNthCalledWith(
      1,
      content.content[0],
      context,
    );
    expect(mockedAppContextResolveBlockContentModule).toHaveBeenNthCalledWith(
      2,
      content.content[1],
      context,
    );

    expect(mockedAppContextResolveFooterContentModule).toHaveBeenCalledTimes(1);
    expect(mockedAppContextResolveFooterContentModule).toHaveBeenCalledWith(
      content.footer[0],
      context,
    );
  });

  it("resolves empty content and footer arrays", () => {
    const content = {
      header: {
        title: "Home",
        eyebrow: null,
        intro: null,
      },
      content: [],
      footer: [],
    } as const;

    mockedAppContextResolvePageContentHead.mockReturnValue(content.header);

    const result = appContextResolvePageContent(content, context);

    expect(result).toEqual({
      header: content.header,
      content: [],
      footer: [],
    });

    expect(mockedAppContextResolvePageContentHead).toHaveBeenCalledWith(
      content.header,
      context,
    );
    expect(mockedAppContextResolveBlockContentModule).not.toHaveBeenCalled();
    expect(mockedAppContextResolveFooterContentModule).not.toHaveBeenCalled();
  });
});
