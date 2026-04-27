// tests/src/app-context/resolve/page/content/block/block.page-content.resolve.app-context.test.ts

import { appContextResolveBlockContentModule } from "@app-context/resolve/page/content/block/block.page-content.resolve.app-context";
import { appContextResolveParagraphBlockContentModule } from "@app-context/resolve/page/content/block/paragraph.resolve.app-context";
import { appContextResolveListBlockContentModule } from "@app-context/resolve/page/content/block/list.resolve.app-context";
import { appContextResolveQuoteBlockContentModule } from "@app-context/resolve/page/content/block/quote.resolve.app-context";
import { appContextResolveHeroBlockContentModule } from "@app-context/resolve/page/content/block/hero.resolve.app-context";
import { appContextResolveJournalListingBlockContentModule } from "@app-context/resolve/page/content/block/journal-listing.resolve.app-context";
import { appContextResolvePreBlockContentModule } from "@app-context/resolve/page/content/block/pre.resolve.app-context";
import { appContextResolveArticleSectionBlockContentModule } from "@app-context/resolve/page/content/block/article-section.resolve.app-context";

jest.mock(
  "@app-context/resolve/page/content/block/paragraph.resolve.app-context",
  () => ({
    appContextResolveParagraphBlockContentModule: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page/content/block/list.resolve.app-context",
  () => ({
    appContextResolveListBlockContentModule: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page/content/block/quote.resolve.app-context",
  () => ({
    appContextResolveQuoteBlockContentModule: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page/content/block/hero.resolve.app-context",
  () => ({
    appContextResolveHeroBlockContentModule: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page/content/block/journal-listing.resolve.app-context",
  () => ({
    appContextResolveJournalListingBlockContentModule: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page/content/block/pre.resolve.app-context",
  () => ({
    appContextResolvePreBlockContentModule: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page/content/block/article-section.resolve.app-context",
  () => ({
    appContextResolveArticleSectionBlockContentModule: jest.fn(),
  }),
);

describe("appContextResolveBlockContentModule", () => {
  const context = {} as never;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("dispatches paragraph modules to the paragraph resolver", () => {
    const module = {
      kind: "paragraph",
      flow: "content",
      content: [],
    } as const;

    const resolved = module;

    jest
      .mocked(appContextResolveParagraphBlockContentModule)
      .mockReturnValue(resolved);

    const result = appContextResolveBlockContentModule(module, context);

    expect(result).toBe(resolved);
    expect(appContextResolveParagraphBlockContentModule).toHaveBeenCalledWith(
      module,
      context,
    );
  });

  it("dispatches list modules to the list resolver", () => {
    const module = {
      kind: "list",
      style: "unordered",
      flow: "content",
      items: [],
    } as const;

    const resolved = module;

    jest
      .mocked(appContextResolveListBlockContentModule)
      .mockReturnValue(resolved);

    const result = appContextResolveBlockContentModule(module, context);

    expect(result).toBe(resolved);
    expect(appContextResolveListBlockContentModule).toHaveBeenCalledWith(
      module,
      context,
    );
  });

  it("dispatches quote modules to the quote resolver", () => {
    const module = {
      kind: "quote",
      id: "quote-1",
      text: "Quote",
      attribution: "Author",
      flow: "content",
    } as const;

    const resolved = module;

    jest
      .mocked(appContextResolveQuoteBlockContentModule)
      .mockReturnValue(resolved);

    const result = appContextResolveBlockContentModule(module, context);

    expect(result).toBe(resolved);
    expect(appContextResolveQuoteBlockContentModule).toHaveBeenCalledWith(
      module,
      context,
    );
  });

  it("dispatches hero modules to the hero resolver", () => {
    const module = {
      kind: "hero",
      photoId: "photo-hero-about",
      immersive: false,
      flow: "breakout",
    } as const;

    const resolved = module;

    jest
      .mocked(appContextResolveHeroBlockContentModule)
      .mockReturnValue(resolved);

    const result = appContextResolveBlockContentModule(module, context);

    expect(result).toBe(resolved);
    expect(appContextResolveHeroBlockContentModule).toHaveBeenCalledWith(
      module,
      context,
    );
  });

  it("dispatches journal listing modules to the journal listing resolver", () => {
    const module = {
      kind: "journalListing",
      pagination: {
        pageSize: 10,
      },
      flow: "content",
    } as const;

    const resolved = module;

    jest
      .mocked(appContextResolveJournalListingBlockContentModule)
      .mockReturnValue(resolved);

    const result = appContextResolveBlockContentModule(module, context);

    expect(result).toBe(resolved);
    expect(
      appContextResolveJournalListingBlockContentModule,
    ).toHaveBeenCalledWith(module, context);
  });

  it("dispatches pre modules to the pre resolver", () => {
    const module = {
      kind: "pre",
      value: "const x = 1;",
      flow: "content",
    } as const;

    const resolved = module;

    jest
      .mocked(appContextResolvePreBlockContentModule)
      .mockReturnValue(resolved);

    const result = appContextResolveBlockContentModule(module, context);

    expect(result).toBe(resolved);
    expect(appContextResolvePreBlockContentModule).toHaveBeenCalledWith(
      module,
      context,
    );
  });

  it("dispatches article section modules to the article section resolver", () => {
    const module = {
      kind: "articleSection",
      heading: {
        text: "Section heading",
        visuallyHidden: false,
        level: 2,
      },
      modules: [],
    } as const;

    const resolved = module;

    jest
      .mocked(appContextResolveArticleSectionBlockContentModule)
      .mockReturnValue(resolved);

    const result = appContextResolveBlockContentModule(module, context);

    expect(result).toBe(resolved);
    expect(
      appContextResolveArticleSectionBlockContentModule,
    ).toHaveBeenCalledWith(module, context);
  });

  it("throws when no resolver is registered for the module kind", () => {
    expect(() =>
      appContextResolveBlockContentModule(
        {
          kind: "unknown",
        } as never,
        context,
      ),
    ).toThrow(
      "No AppContext block content resolver registered for kind: unknown",
    );
  });
});
