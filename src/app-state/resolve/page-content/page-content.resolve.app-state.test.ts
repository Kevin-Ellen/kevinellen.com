// src/app-state/resolve/page-content/page-content.resolve.app-state.test.ts

import { appStateResolvePageContent } from "@app-state/resolve/page-content/page-content.resolve.app-state";

import { appStateResolvePageContentHead } from "@app-state/resolve/page-content/site/content-head.resolve.app-state";
import { appStateResolveBlock } from "@app-state/resolve/page-content/block/block.resolve.app-state";
import { appStateResolveFooter } from "@app-state/resolve/page-content/footer/footer.resolve.app-state";

jest.mock(
  "@app-state/resolve/page-content/site/content-head.resolve.app-state",
  () => ({
    appStateResolvePageContentHead: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/block/block.resolve.app-state",
  () => ({
    appStateResolveBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/footer/footer.resolve.app-state",
  () => ({
    appStateResolveFooter: jest.fn(),
  }),
);

describe("appStateResolvePageContent", () => {
  const mockedAppStateResolvePageContentHead = jest.mocked(
    appStateResolvePageContentHead,
  );
  const mockedAppStateResolveBlock = jest.mocked(appStateResolveBlock);
  const mockedAppStateResolveFooter = jest.mocked(appStateResolveFooter);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves head, blocks, and footer modules", () => {
    const head = {
      title: "Journal",
    };

    const block = {
      kind: "paragraph",
      content: [],
    };

    const footer = {
      kind: "journalEntryFooter",
      publication: {
        author: "Kevin Ellen",
        publishedAt: "2026-05-06",
        updatedAt: [],
      },
      tags: [],
    };

    const content = {
      head,
      content: [block],
      footer: [footer],
    };

    const resolvedHead = {
      title: "Journal",
      eyebrow: null,
      intro: null,
      showInBody: true,
    };

    const resolvedBlock = {
      kind: "paragraph",
      content: [],
      flow: "content",
    };

    const resolvedFooter = footer;

    mockedAppStateResolvePageContentHead.mockReturnValue(resolvedHead as never);
    mockedAppStateResolveBlock.mockReturnValue(resolvedBlock as never);
    mockedAppStateResolveFooter.mockReturnValue(resolvedFooter as never);

    expect(appStateResolvePageContent(content as never)).toEqual({
      head: resolvedHead,
      content: [resolvedBlock],
      footer: [resolvedFooter],
    });

    expect(mockedAppStateResolvePageContentHead).toHaveBeenCalledWith(head);

    expect(mockedAppStateResolveBlock).toHaveBeenCalledWith(
      block,
      0,
      content.content,
    );

    expect(mockedAppStateResolveFooter).toHaveBeenCalledWith(
      footer,
      0,
      content.footer,
    );
  });

  it("defaults missing footer to an empty array", () => {
    const head = {
      title: "Journal",
    };

    const content = {
      head,
      content: [],
    };

    const resolvedHead = {
      title: "Journal",
      eyebrow: null,
      intro: null,
      showInBody: true,
    };

    mockedAppStateResolvePageContentHead.mockReturnValue(resolvedHead as never);

    expect(appStateResolvePageContent(content as never)).toEqual({
      head: resolvedHead,
      content: [],
      footer: [],
    });

    expect(mockedAppStateResolvePageContentHead).toHaveBeenCalledWith(head);
    expect(mockedAppStateResolveBlock).not.toHaveBeenCalled();
    expect(mockedAppStateResolveFooter).not.toHaveBeenCalled();
  });
});
