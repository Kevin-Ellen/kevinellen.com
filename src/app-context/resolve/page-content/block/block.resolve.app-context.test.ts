// src/app-context/resolve/page-content/block/block.resolve.app-context.test.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppStateBlock } from "@shared-types/page-content/block/app-state.block.types";

import { appContextResolveBlock } from "@app-context/resolve/page-content/block/block.resolve.app-context";

import { appContextResolveArticleSectionBlock } from "@app-context/resolve/page-content/block/article-section.resolve.app-context";
import { appContextResolveHeroBlock } from "@app-context/resolve/page-content/block/hero.resolve.app-context";
import { appContextResolveHomepageHero } from "@app-context/resolve/page-content/block/homepage-hero.resolve.app-context";
import { appContextResolveHomepageJournalListingBlock } from "@app-context/resolve/page-content/block/homepage-journal-listing.resolve.app-context";
import { appContextResolveImageStripBlock } from "@app-context/resolve/page-content/block/image-strip.resolve.app-context";
import { appContextResolveJournalListingBlock } from "@app-context/resolve/page-content/block/journal-listing.resolve.app-context";
import { appContextResolveListBlock } from "@app-context/resolve/page-content/block/list.resolve.app-context";
import { appContextResolveParagraphBlock } from "@app-context/resolve/page-content/block/paragraph.resolve.app-context";
import { appContextResolvePreBlock } from "@app-context/resolve/page-content/block/pre.resolve.app-context";
import { appContextResolveQuoteBlock } from "@app-context/resolve/page-content/block/quote.resolve.app-context";
import { appContextResolveSectionLinksBlock } from "@app-context/resolve/page-content/block/section-links.resolve.app-context";

jest.mock(
  "@app-context/resolve/page-content/block/article-section.resolve.app-context",
  () => ({
    appContextResolveArticleSectionBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page-content/block/hero.resolve.app-context",
  () => ({
    appContextResolveHeroBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page-content/block/homepage-hero.resolve.app-context",
  () => ({
    appContextResolveHomepageHero: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page-content/block/homepage-journal-listing.resolve.app-context",
  () => ({
    appContextResolveHomepageJournalListingBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page-content/block/image-strip.resolve.app-context",
  () => ({
    appContextResolveImageStripBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page-content/block/journal-listing.resolve.app-context",
  () => ({
    appContextResolveJournalListingBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page-content/block/list.resolve.app-context",
  () => ({
    appContextResolveListBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page-content/block/paragraph.resolve.app-context",
  () => ({
    appContextResolveParagraphBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page-content/block/pre.resolve.app-context",
  () => ({
    appContextResolvePreBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page-content/block/quote.resolve.app-context",
  () => ({
    appContextResolveQuoteBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-context/resolve/page-content/block/section-links.resolve.app-context",
  () => ({
    appContextResolveSectionLinksBlock: jest.fn(),
  }),
);

describe("appContextResolveBlock", () => {
  const context = {} as AppContextPageContentResolverContext;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    ["paragraph", appContextResolveParagraphBlock],
    ["list", appContextResolveListBlock],
    ["quote", appContextResolveQuoteBlock],
    ["hero", appContextResolveHeroBlock],
    ["journalListing", appContextResolveJournalListingBlock],
    ["pre", appContextResolvePreBlock],
    ["articleSection", appContextResolveArticleSectionBlock],
    ["homepageHero", appContextResolveHomepageHero],
    ["imageStrip", appContextResolveImageStripBlock],
    ["homepageJournalListing", appContextResolveHomepageJournalListingBlock],
    ["sectionLinks", appContextResolveSectionLinksBlock],
  ] as const)("resolves %s blocks", (kind, resolver) => {
    const block = {
      kind,
    } as AppStateBlock;

    const resolved = {
      kind,
      resolved: true,
    };

    jest.mocked(resolver).mockReturnValue(resolved as never);

    const result = appContextResolveBlock(block as never, context);

    expect(result).toBe(resolved);
    expect(resolver).toHaveBeenCalledTimes(1);
    expect(resolver).toHaveBeenCalledWith(block, context);
  });
});
