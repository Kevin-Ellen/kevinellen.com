// tests/src/app-state/resolve/page-content/block/block.page-content.resolve.app-state.test.ts

jest.mock(
  "@app-state/resolve/page-content/block/paragraph.resolve.app-state",
  () => ({
    appStateResolveParagraphBlockContentModule: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/block/list.resolve.app-state",
  () => ({
    appStateResolveListBlockContentModule: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/block/quote.resolve.app-state",
  () => ({
    appStateResolveQuoteBlockContentModule: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/block/hero.resolve.app-state",
  () => ({
    appStateResolveHeroBlockContentModule: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/block/journal-listing.resolve.app-state",
  () => ({
    appStateResolveJournalListingBlockContentModule: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/block/pre.resolve.app-state",
  () => ({
    appStateResolvePreBlockContentModule: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/block/article-section.resolve.app-state",
  () => ({
    appStateResolveArticleSectionBlockContentModule: jest.fn(),
  }),
);

import { appStateResolveBlockContentModule } from "@app-state/resolve/page-content/block/block.page-content.resolve.app-state";
import { appStateResolveParagraphBlockContentModule } from "@app-state/resolve/page-content/block/paragraph.resolve.app-state";
import { appStateResolveListBlockContentModule } from "@app-state/resolve/page-content/block/list.resolve.app-state";
import { appStateResolveQuoteBlockContentModule } from "@app-state/resolve/page-content/block/quote.resolve.app-state";
import { appStateResolveHeroBlockContentModule } from "@app-state/resolve/page-content/block/hero.resolve.app-state";
import { appStateResolveJournalListingBlockContentModule } from "@app-state/resolve/page-content/block/journal-listing.resolve.app-state";
import { appStateResolvePreBlockContentModule } from "@app-state/resolve/page-content/block/pre.resolve.app-state";
import { appStateResolveArticleSectionBlockContentModule } from "@app-state/resolve/page-content/block/article-section.resolve.app-state";

const mockedAppStateResolveParagraphBlockContentModule = jest.mocked(
  appStateResolveParagraphBlockContentModule,
);
const mockedAppStateResolveListBlockContentModule = jest.mocked(
  appStateResolveListBlockContentModule,
);
const mockedAppStateResolveQuoteBlockContentModule = jest.mocked(
  appStateResolveQuoteBlockContentModule,
);
const mockedAppStateResolveHeroBlockContentModule = jest.mocked(
  appStateResolveHeroBlockContentModule,
);
const mockedAppStateResolveJournalListingBlockContentModule = jest.mocked(
  appStateResolveJournalListingBlockContentModule,
);
const mockedAppStateResolvePreBlockContentModule = jest.mocked(
  appStateResolvePreBlockContentModule,
);
const mockedAppStateResolveArticleSectionBlockContentModule = jest.mocked(
  appStateResolveArticleSectionBlockContentModule,
);

describe("appStateResolveBlockContentModule", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("dispatches paragraph modules through the paragraph block resolver", () => {
    const module = {
      kind: "paragraph",
      content: [],
    } as const;

    const resolvedModule = {
      kind: "paragraph",
      flow: "content",
      content: [],
    } as const;

    mockedAppStateResolveParagraphBlockContentModule.mockReturnValue(
      resolvedModule,
    );

    const result = appStateResolveBlockContentModule(module);

    expect(
      mockedAppStateResolveParagraphBlockContentModule,
    ).toHaveBeenCalledWith(module);
    expect(result).toBe(resolvedModule);
  });

  it("dispatches list modules through the list block resolver", () => {
    const module = {
      kind: "list",
      items: [],
    } as const;

    const resolvedModule = {
      kind: "list",
      style: "unordered",
      flow: "content",
      items: [],
    } as const;

    mockedAppStateResolveListBlockContentModule.mockReturnValue(resolvedModule);

    const result = appStateResolveBlockContentModule(module);

    expect(mockedAppStateResolveListBlockContentModule).toHaveBeenCalledWith(
      module,
    );
    expect(result).toBe(resolvedModule);
  });

  it("dispatches quote modules through the quote block resolver", () => {
    const module = {
      kind: "quote",
      id: "quote-1",
      text: "A quote",
      flow: "content",
    } as const;

    const resolvedModule = {
      kind: "quote",
      id: "quote-1",
      text: "A quote",
      attribution: null,
      flow: "content",
    } as const;

    mockedAppStateResolveQuoteBlockContentModule.mockReturnValue(
      resolvedModule,
    );

    const result = appStateResolveBlockContentModule(module);

    expect(mockedAppStateResolveQuoteBlockContentModule).toHaveBeenCalledWith(
      module,
    );
    expect(result).toBe(resolvedModule);
  });

  it("dispatches hero modules through the hero block resolver", () => {
    const module = {
      kind: "hero",
      photoId: "hero-photo",
    } as const;

    const resolvedModule = {
      kind: "hero",
      photoId: "hero-photo",
      immersive: false,
      flow: "content",
    } as const;

    mockedAppStateResolveHeroBlockContentModule.mockReturnValue(resolvedModule);

    const result = appStateResolveBlockContentModule(module);

    expect(mockedAppStateResolveHeroBlockContentModule).toHaveBeenCalledWith(
      module,
    );
    expect(result).toBe(resolvedModule);
  });

  it("dispatches journalListing modules through the journal listing block resolver", () => {
    const module = {
      kind: "journalListing",
      pagination: {
        pageSize: 12,
      },
      flow: "content",
    } as const;

    const resolvedModule = {
      kind: "journalListing",
      pagination: {
        pageSize: 12,
      },
      flow: "content",
    } as const;

    mockedAppStateResolveJournalListingBlockContentModule.mockReturnValue(
      resolvedModule,
    );

    const result = appStateResolveBlockContentModule(module);

    expect(
      mockedAppStateResolveJournalListingBlockContentModule,
    ).toHaveBeenCalledWith(module);
    expect(result).toBe(resolvedModule);
  });

  it("dispatches pre modules through the pre block resolver", () => {
    const module = {
      kind: "pre",
      value: "const answer = 42;",
    } as const;

    const resolvedModule = {
      kind: "pre",
      value: "const answer = 42;",
      flow: "content",
    } as const;

    mockedAppStateResolvePreBlockContentModule.mockReturnValue(resolvedModule);

    const result = appStateResolveBlockContentModule(module);

    expect(mockedAppStateResolvePreBlockContentModule).toHaveBeenCalledWith(
      module,
    );
    expect(result).toBe(resolvedModule);
  });

  it("dispatches articleSection modules through the article section block resolver", () => {
    const module = {
      kind: "articleSection",
      heading: {
        text: "Section",
        level: 2,
      },
      modules: [],
    } as const;

    const resolvedModule = {
      kind: "articleSection",
      heading: {
        text: "Section",
        level: 2,
        visuallyHidden: false,
      },
      modules: [],
    } as const;

    mockedAppStateResolveArticleSectionBlockContentModule.mockReturnValue(
      resolvedModule,
    );

    const result = appStateResolveBlockContentModule(module);

    expect(
      mockedAppStateResolveArticleSectionBlockContentModule,
    ).toHaveBeenCalledWith(module);
    expect(result).toBe(resolvedModule);
  });

  it("throws a clear error when no block resolver is registered for the kind", () => {
    expect(() =>
      appStateResolveBlockContentModule({
        kind: "unknown",
      } as never),
    ).toThrow(
      "No AppState block content resolver registered for kind: unknown",
    );
  });
});
