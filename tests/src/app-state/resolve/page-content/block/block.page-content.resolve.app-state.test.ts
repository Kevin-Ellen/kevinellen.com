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
  "@app-state/resolve/page-content/block/content-section.resolve.app-state",
  () => ({
    appStateResolveContentSectionBlockContentModule: jest.fn(),
  }),
);

import { appStateResolveParagraphBlockContentModule } from "@app-state/resolve/page-content/block/paragraph.resolve.app-state";
import { appStateResolveListBlockContentModule } from "@app-state/resolve/page-content/block/list.resolve.app-state";
import { appStateResolveQuoteBlockContentModule } from "@app-state/resolve/page-content/block/quote.resolve.app-state";
import { appStateResolveHeroBlockContentModule } from "@app-state/resolve/page-content/block/hero.resolve.app-state";
import { appStateResolveJournalListingBlockContentModule } from "@app-state/resolve/page-content/block/journal-listing.resolve.app-state";
import { appStateResolvePreBlockContentModule } from "@app-state/resolve/page-content/block/pre.resolve.app-state";
import { appStateResolveContentSectionBlockContentModule } from "@app-state/resolve/page-content/block/content-section.resolve.app-state";

import { appStateResolveBlockContentModule } from "@app-state/resolve/page-content/block/block.page-content.resolve.app-state";

const mockedAppStateResolveParagraphBlockContentModule =
  appStateResolveParagraphBlockContentModule as jest.MockedFunction<
    typeof appStateResolveParagraphBlockContentModule
  >;

const mockedAppStateResolveListBlockContentModule =
  appStateResolveListBlockContentModule as jest.MockedFunction<
    typeof appStateResolveListBlockContentModule
  >;

const mockedAppStateResolveQuoteBlockContentModule =
  appStateResolveQuoteBlockContentModule as jest.MockedFunction<
    typeof appStateResolveQuoteBlockContentModule
  >;

const mockedAppStateResolveHeroBlockContentModule =
  appStateResolveHeroBlockContentModule as jest.MockedFunction<
    typeof appStateResolveHeroBlockContentModule
  >;

const mockedAppStateResolveJournalListingBlockContentModule =
  appStateResolveJournalListingBlockContentModule as jest.MockedFunction<
    typeof appStateResolveJournalListingBlockContentModule
  >;

const mockedAppStateResolvePreBlockContentModule =
  appStateResolvePreBlockContentModule as jest.MockedFunction<
    typeof appStateResolvePreBlockContentModule
  >;

const mockedAppStateResolveContentSectionBlockContentModule =
  appStateResolveContentSectionBlockContentModule as jest.MockedFunction<
    typeof appStateResolveContentSectionBlockContentModule
  >;

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
      content: [],
    } as const;

    mockedAppStateResolveParagraphBlockContentModule.mockReturnValue(
      resolvedModule as ReturnType<
        typeof appStateResolveParagraphBlockContentModule
      >,
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
      items: [],
    } as const;

    mockedAppStateResolveListBlockContentModule.mockReturnValue(
      resolvedModule as ReturnType<
        typeof appStateResolveListBlockContentModule
      >,
    );

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
    } as const;

    const resolvedModule = {
      kind: "quote",
      id: "quote-1",
      text: "A quote",
      attribution: null,
    } as const;

    mockedAppStateResolveQuoteBlockContentModule.mockReturnValue(
      resolvedModule as ReturnType<
        typeof appStateResolveQuoteBlockContentModule
      >,
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

    mockedAppStateResolveHeroBlockContentModule.mockReturnValue(
      resolvedModule as ReturnType<
        typeof appStateResolveHeroBlockContentModule
      >,
    );

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
    } as const;

    const resolvedModule = {
      kind: "journalListing",
      pagination: {
        pageSize: 12,
      },
    } as const;

    mockedAppStateResolveJournalListingBlockContentModule.mockReturnValue(
      resolvedModule as ReturnType<
        typeof appStateResolveJournalListingBlockContentModule
      >,
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
    } as const;

    mockedAppStateResolvePreBlockContentModule.mockReturnValue(
      resolvedModule as ReturnType<typeof appStateResolvePreBlockContentModule>,
    );

    const result = appStateResolveBlockContentModule(module);

    expect(mockedAppStateResolvePreBlockContentModule).toHaveBeenCalledWith(
      module,
    );
    expect(result).toBe(resolvedModule);
  });

  it("dispatches contentSection modules through the content section block resolver", () => {
    const module = {
      kind: "contentSection",
      modules: [],
    } as const;

    const resolvedModule = {
      kind: "contentSection",
      heading: null,
      modules: [],
    } as const;

    mockedAppStateResolveContentSectionBlockContentModule.mockReturnValue(
      resolvedModule as ReturnType<
        typeof appStateResolveContentSectionBlockContentModule
      >,
    );

    const result = appStateResolveBlockContentModule(module);

    expect(
      mockedAppStateResolveContentSectionBlockContentModule,
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
