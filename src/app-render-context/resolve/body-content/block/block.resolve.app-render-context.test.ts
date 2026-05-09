// src/app-render-context/resolve/body-content/block/block.resolve.app-render-context.test.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextBlock } from "@shared-types/page-content/block/app-context.block.types";

import { appRenderContextResolveArticleSectionBlock } from "@app-render-context/resolve/body-content/block/article-section.resolve.app-render-context";
import { appRenderContextResolveBlock } from "@app-render-context/resolve/body-content/block/block.resolve.app-render-context";
import { appRenderContextResolveHeroBlock } from "@app-render-context/resolve/body-content/block/hero.resolve.app-render-context";
import { appRenderContextResolveHomepageHeroBlock } from "@app-render-context/resolve/body-content/block/homepage-hero.resolve.app-render-context";
import { appRenderContextResolveHomepageJournalListingBlock } from "@app-render-context/resolve/body-content/block/homepage-journal-listing.resolve.app-render-context";
import { appRenderContextResolveImageStripBlock } from "@app-render-context/resolve/body-content/block/image-strip.resolve.app-render-context";
import { appRenderContextResolveJournalListingBlock } from "@app-render-context/resolve/body-content/block/journal-listing.resolve.app-render-context";
import { appRenderContextResolveListBlock } from "@app-render-context/resolve/body-content/block/list.resolve.app-render-context";
import { appRenderContextResolveParagraphBlock } from "@app-render-context/resolve/body-content/block/paragraph.resolve.app-render-context";
import { appRenderContextResolvePreBlock } from "@app-render-context/resolve/body-content/block/pre.resolve.app-render-context";
import { appRenderContextResolveQuoteBlock } from "@app-render-context/resolve/body-content/block/quote.resolve.app-render-context";
import { appRenderContextResolveSectionLinksBlock } from "@app-render-context/resolve/body-content/block/section-links.resolve.app-render-context";

jest.mock(
  "@app-render-context/resolve/body-content/block/article-section.resolve.app-render-context",
  () => ({
    appRenderContextResolveArticleSectionBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/block/hero.resolve.app-render-context",
  () => ({
    appRenderContextResolveHeroBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/block/homepage-hero.resolve.app-render-context",
  () => ({
    appRenderContextResolveHomepageHeroBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/block/homepage-journal-listing.resolve.app-render-context",
  () => ({
    appRenderContextResolveHomepageJournalListingBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/block/image-strip.resolve.app-render-context",
  () => ({
    appRenderContextResolveImageStripBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/block/journal-listing.resolve.app-render-context",
  () => ({
    appRenderContextResolveJournalListingBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/block/list.resolve.app-render-context",
  () => ({
    appRenderContextResolveListBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/block/paragraph.resolve.app-render-context",
  () => ({
    appRenderContextResolveParagraphBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/block/pre.resolve.app-render-context",
  () => ({
    appRenderContextResolvePreBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/block/quote.resolve.app-render-context",
  () => ({
    appRenderContextResolveQuoteBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-render-context/resolve/body-content/block/section-links.resolve.app-render-context",
  () => ({
    appRenderContextResolveSectionLinksBlock: jest.fn(),
  }),
);

describe("appRenderContextResolveBlock", () => {
  const appContext = {} as unknown as AppContext;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    ["articleSection", appRenderContextResolveArticleSectionBlock, true],
    ["hero", appRenderContextResolveHeroBlock, true],
    ["homepageHero", appRenderContextResolveHomepageHeroBlock, true],
    [
      "homepageJournalListing",
      appRenderContextResolveHomepageJournalListingBlock,
      true,
    ],
    ["imageStrip", appRenderContextResolveImageStripBlock, true],
    ["journalListing", appRenderContextResolveJournalListingBlock, true],
    ["list", appRenderContextResolveListBlock, true],
    ["paragraph", appRenderContextResolveParagraphBlock, true],
    ["pre", appRenderContextResolvePreBlock, false],
    ["quote", appRenderContextResolveQuoteBlock, false],
    ["sectionLinks", appRenderContextResolveSectionLinksBlock, true],
  ] as const)("resolves %s blocks", (kind, resolver, receivesAppContext) => {
    const block = { kind } as unknown as AppContextBlock;
    const resolvedBlock = { kind, resolved: true };

    jest.mocked(resolver).mockReturnValue(resolvedBlock as never);

    expect(appRenderContextResolveBlock(appContext, block as never)).toEqual(
      resolvedBlock,
    );

    expect(resolver).toHaveBeenCalledTimes(1);

    if (receivesAppContext) {
      expect(resolver).toHaveBeenCalledWith(appContext, block);
    } else {
      expect(resolver).toHaveBeenCalledWith(block);
    }
  });

  it("throws when no block resolver is registered", () => {
    const block = {
      kind: "missingBlock",
    } as never;

    expect(() => appRenderContextResolveBlock(appContext, block)).toThrow(
      "No AppRenderContext block resolver registered for kind: missingBlock",
    );
  });
});
