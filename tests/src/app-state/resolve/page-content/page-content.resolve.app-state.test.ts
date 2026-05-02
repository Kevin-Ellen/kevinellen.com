// tests/src/app-state/resolve/page-content/page-content.resolve.app-state.test.ts

import { appStateResolvePageContent } from "@app-state/resolve/page-content/page-content.resolve.app-state";
import { appStateResolvePageContentHead } from "@app-state/resolve/page-content/site/content-head.resolve.app-state";
import { appStateResolveBlockContentModule } from "@app-state/resolve/page-content/block/block.page-content.resolve.app-state";
import { appStateResolveFooterContentModule } from "@app-state/resolve/page-content/footer/footer.resolve.app-state";

import type { AuthoredPageContent } from "@shared-types/page-content/authored.page-content.types";

jest.mock(
  "@app-state/resolve/page-content/site/content-head.resolve.app-state",
  () => ({
    appStateResolvePageContentHead: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/block/block.page-content.resolve.app-state",
  () => ({
    appStateResolveBlockContentModule: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/footer/footer.resolve.app-state",
  () => ({
    appStateResolveFooterContentModule: jest.fn(),
  }),
);

const mockedAppStateResolvePageContentHead = jest.mocked(
  appStateResolvePageContentHead,
);

const mockedAppStateResolveBlockContentModule = jest.mocked(
  appStateResolveBlockContentModule,
);

const mockedAppStateResolveFooterContentModule = jest.mocked(
  appStateResolveFooterContentModule,
);

describe("appStateResolvePageContent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("defaults footer to an empty array when omitted", () => {
    const authoredContent: AuthoredPageContent = {
      header: {
        title: "About",
      },
      content: [],
    };

    mockedAppStateResolvePageContentHead.mockReturnValue({
      title: "About",
      eyebrow: null,
      intro: null,
    });

    const result = appStateResolvePageContent(authoredContent);

    expect(mockedAppStateResolvePageContentHead).toHaveBeenCalledWith(
      authoredContent.header,
    );
    expect(mockedAppStateResolveBlockContentModule).not.toHaveBeenCalled();
    expect(mockedAppStateResolveFooterContentModule).not.toHaveBeenCalled();
    expect(result.footer).toEqual([]);
  });

  it("maps body modules through the block resolver and footer modules through the footer resolver", () => {
    const bodyBlockA = { kind: "body-a" } as never;
    const bodyBlockB = { kind: "body-b" } as never;

    const footerBlock = {
      kind: "journalEntryFooter",
      author: "Kevin Ellen",
      publishedAt: "2025-05-27T10:30:00.000Z",
      updatedAt: [],
      tags: [],
    } as never;

    const authoredContent: AuthoredPageContent = {
      header: {
        title: "Journal",
      },
      content: [bodyBlockA, bodyBlockB],
      footer: [footerBlock],
    };

    mockedAppStateResolvePageContentHead.mockReturnValue({
      title: "Journal",
      eyebrow: null,
      intro: null,
    });

    mockedAppStateResolveBlockContentModule
      .mockReturnValueOnce({ kind: "resolved-body-a" } as never)
      .mockReturnValueOnce({ kind: "resolved-body-b" } as never);

    mockedAppStateResolveFooterContentModule.mockReturnValueOnce({
      kind: "journalEntryFooter",
      publication: {
        author: "Kevin Ellen",
        publishedAt: "2025-05-27T10:30:00.000Z",
        updatedAt: [],
      },
      tags: [],
    } as never);

    const result = appStateResolvePageContent(authoredContent);

    expect(mockedAppStateResolveBlockContentModule).toHaveBeenCalledTimes(2);
    expect(mockedAppStateResolveBlockContentModule.mock.calls[0]?.[0]).toBe(
      bodyBlockA,
    );
    expect(mockedAppStateResolveBlockContentModule.mock.calls[1]?.[0]).toBe(
      bodyBlockB,
    );

    expect(mockedAppStateResolveFooterContentModule).toHaveBeenCalledTimes(1);
    expect(mockedAppStateResolveFooterContentModule).toHaveBeenCalledWith(
      footerBlock,
      0,
      [footerBlock],
    );

    expect(result.content).toEqual([
      { kind: "resolved-body-a" },
      { kind: "resolved-body-b" },
    ]);

    expect(result.footer).toEqual([
      {
        kind: "journalEntryFooter",
        publication: {
          author: "Kevin Ellen",
          publishedAt: "2025-05-27T10:30:00.000Z",
          updatedAt: [],
        },
        tags: [],
      },
    ]);
  });
});
