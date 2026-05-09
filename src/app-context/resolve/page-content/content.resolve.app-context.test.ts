// src/app-context/resolve/page-content/content.resolve.app-context.test.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppStatePageContent } from "@shared-types/page-content/app-state.page-content.types";

import { appContextResolvePageContent } from "@app-context/resolve/page-content/content.resolve.app-context";

import { appContextResolvePageContentHead } from "@app-context/resolve/page-content/head/content-head.resolve.app-context";
import { appContextResolveBlock } from "@app-context/resolve/page-content/block/block.resolve.app-context";
import { appContextResolveFooter } from "@app-context/resolve/page-content/footer/footer.resolve.app-context";

jest.mock(
  "@app-context/resolve/page-content/head/content-head.resolve.app-context",
  () => ({
    appContextResolvePageContentHead: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page-content/block/block.resolve.app-context",
  () => ({
    appContextResolveBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page-content/footer/footer.resolve.app-context",
  () => ({
    appContextResolveFooter: jest.fn(),
  }),
);

describe("appContextResolvePageContent", () => {
  const mockedAppContextResolvePageContentHead = jest.mocked(
    appContextResolvePageContentHead,
  );

  const mockedAppContextResolveBlock = jest.mocked(appContextResolveBlock);

  const mockedAppContextResolveFooter = jest.mocked(appContextResolveFooter);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves head, content blocks, and footer modules", () => {
    const context = {} as AppContextPageContentResolverContext;

    const content: AppStatePageContent = {
      head: {
        title: "Birds of Essex",
        eyebrow: "Journal",
        intro: "A quiet spring morning.",
        showInBody: true,
      },
      content: [
        {
          kind: "paragraph",
          flow: "content",
          content: [],
        },
      ],
      footer: [
        {
          kind: "journalEntryFooter",
          publication: {
            author: "Kevin",
            publishedAt: "2025-05-10",
            updatedAt: [],
          },
          tags: [],
        },
      ],
    };

    mockedAppContextResolvePageContentHead.mockReturnValue({
      title: "Resolved title",
      eyebrow: "Resolved eyebrow",
      intro: "Resolved intro",
      showInBody: true,
    });

    mockedAppContextResolveBlock.mockReturnValue({
      kind: "paragraph",
      flow: "content",
      content: [],
    });

    mockedAppContextResolveFooter.mockReturnValue({
      kind: "journalEntryFooter",
      publication: {
        author: "Kevin",
        publishedAt: "2025-05-10",
        updatedAt: [],
      },
      tags: [],
      equipment: {
        cameras: [],
        lenses: [],
      },
    });

    const result = appContextResolvePageContent(content, context);

    expect(result).toEqual({
      head: {
        title: "Resolved title",
        eyebrow: "Resolved eyebrow",
        intro: "Resolved intro",
        showInBody: true,
      },
      content: [
        {
          kind: "paragraph",
          flow: "content",
          content: [],
        },
      ],
      footer: [
        {
          kind: "journalEntryFooter",
          publication: {
            author: "Kevin",
            publishedAt: "2025-05-10",
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

    expect(mockedAppContextResolvePageContentHead).toHaveBeenCalledTimes(1);

    expect(mockedAppContextResolvePageContentHead).toHaveBeenCalledWith(
      content.head,
      context,
    );

    expect(mockedAppContextResolveBlock).toHaveBeenCalledTimes(1);

    expect(mockedAppContextResolveBlock).toHaveBeenCalledWith(
      content.content[0],
      context,
    );

    expect(mockedAppContextResolveFooter).toHaveBeenCalledTimes(1);

    expect(mockedAppContextResolveFooter).toHaveBeenCalledWith(
      content.footer[0],
      context,
    );
  });

  it("preserves empty content and footer arrays", () => {
    const context = {} as AppContextPageContentResolverContext;

    const content: AppStatePageContent = {
      head: {
        title: "Birds of Essex",
        eyebrow: null,
        intro: null,
        showInBody: true,
      },
      content: [],
      footer: [],
    };

    mockedAppContextResolvePageContentHead.mockReturnValue(content.head);

    const result = appContextResolvePageContent(content, context);

    expect(result).toEqual({
      head: content.head,
      content: [],
      footer: [],
    });

    expect(mockedAppContextResolveBlock).not.toHaveBeenCalled();
    expect(mockedAppContextResolveFooter).not.toHaveBeenCalled();
  });
});
