// src/app-state/resolve/page-content/block/block.page-content.resolve.app-state.test.ts

import { appStateResolveBlock } from "@app-state/resolve/page-content/block/block.resolve.app-state";

import { appStateResolveParagraphBlock } from "@app-state/resolve/page-content/block/paragraph/paragraph.resolve.app-state";
import { appStateResolveListBlock } from "@app-state/resolve/page-content/block/list/list.resolve.app-state";
import { appStateResolveQuoteBlock } from "@app-state/resolve/page-content/block/quote/quote.resolve.app-state";
import { appStateResolveHeroBlock } from "@app-state/resolve/page-content/block/hero/hero.resolve.app-state";
import { appStateResolveJournalListingBlock } from "@app-state/resolve/page-content/block/journal-listing/journal-listing.resolve.app-state";
import { appStateResolvePreBlock } from "@app-state/resolve/page-content/block/pre/pre.resolve.app-state";
import { appStateResolveArticleSectionBlock } from "@app-state/resolve/page-content/block/article-section/article-section.resolve.app-state";
import { appStateResolveHomepageHeroBlock } from "@app-state/resolve/page-content/block/homepage-hero/homepage-hero.resolve.app-state";
import { appStateResolveImageStripBlock } from "@app-state/resolve/page-content/block/image-strip/image-strip.resolve.app-state";
import { appStateResolveHomepageJournalListingBlock } from "@app-state/resolve/page-content/block/homepage-journal-listing/homepage-journal-listing.resolve.app-state";
import { appStateResolveSectionLinksBlock } from "@app-state/resolve/page-content/block/section-links/section-links.resolve.app-state";
import { appStateResolveNoteListingBlock } from "@app-state/resolve/page-content/block/note-listing/note-listing.resolve.app-state";
import { appStateResolveHomepageNoteListingBlock } from "@app-state/resolve/page-content/block/homepage-note-listing/homepage-note-listing.resolve.app-state";
import { appStateResolveSequenceBlock } from "@app-state/resolve/page-content/block/sequence/sequence.resolve.app-state";

jest.mock(
  "@app-state/resolve/page-content/block/paragraph/paragraph.resolve.app-state",
  () => ({
    appStateResolveParagraphBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/block/list/list.resolve.app-state",
  () => ({
    appStateResolveListBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/block/quote/quote.resolve.app-state",
  () => ({
    appStateResolveQuoteBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/block/hero/hero.resolve.app-state",
  () => ({
    appStateResolveHeroBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/block/journal-listing/journal-listing.resolve.app-state",
  () => ({
    appStateResolveJournalListingBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/block/pre/pre.resolve.app-state",
  () => ({
    appStateResolvePreBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/block/article-section/article-section.resolve.app-state",
  () => ({
    appStateResolveArticleSectionBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/block/homepage-hero/homepage-hero.resolve.app-state",
  () => ({
    appStateResolveHomepageHeroBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/block/image-strip/image-strip.resolve.app-state",
  () => ({
    appStateResolveImageStripBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/block/homepage-journal-listing/homepage-journal-listing.resolve.app-state",
  () => ({
    appStateResolveHomepageJournalListingBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/block/section-links/section-links.resolve.app-state",
  () => ({
    appStateResolveSectionLinksBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/block/note-listing/note-listing.resolve.app-state",
  () => ({
    appStateResolveNoteListingBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/block/homepage-note-listing/homepage-note-listing.resolve.app-state",
  () => ({
    appStateResolveHomepageNoteListingBlock: jest.fn(),
  }),
);

jest.mock(
  "@app-state/resolve/page-content/block/sequence/sequence.resolve.app-state",
  () => ({
    appStateResolveSequenceBlock: jest.fn(),
  }),
);

describe("appStateResolveBlockContentModule", () => {
  const cases = [
    ["paragraph", appStateResolveParagraphBlock],
    ["list", appStateResolveListBlock],
    ["quote", appStateResolveQuoteBlock],
    ["hero", appStateResolveHeroBlock],
    ["journalListing", appStateResolveJournalListingBlock],
    ["pre", appStateResolvePreBlock],
    ["articleSection", appStateResolveArticleSectionBlock],
    ["homepageHero", appStateResolveHomepageHeroBlock],
    ["imageStrip", appStateResolveImageStripBlock],
    ["homepageJournalListing", appStateResolveHomepageJournalListingBlock],
    ["sectionLinks", appStateResolveSectionLinksBlock],
    ["noteListing", appStateResolveNoteListingBlock],
    ["homepageNoteListing", appStateResolveHomepageNoteListingBlock],
    ["sequence", appStateResolveSequenceBlock],
  ] as const;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each(cases)(
    "delegates %s blocks to the matching resolver",
    (kind, resolver) => {
      const module = {
        kind,
      };

      const resolvedModule = {
        kind,
        resolved: true,
      };

      jest.mocked(resolver).mockReturnValue(resolvedModule as never);

      expect(appStateResolveBlock(module as never)).toBe(resolvedModule);

      expect(resolver).toHaveBeenCalledTimes(1);
      expect(resolver).toHaveBeenCalledWith(module);
    },
  );

  it("throws when no resolver is registered for the block kind", () => {
    expect(() =>
      appStateResolveBlock({
        kind: "missing",
      } as never),
    ).toThrow(
      "No AppState block content resolver registered for kind: missing",
    );
  });
});
