// src/rendering/body-content/block/block.renderer.test.ts

import type { AppRenderContextBlock } from "@shared-types/page-content/block/app-render-context.block.types";

import { renderBlock } from "@rendering/body-content/block/block.renderer";

import { renderArticleSectionBlock } from "@rendering/body-content/block/article-section/article-section.block.renderer";
import { renderHeroBlock } from "@rendering/body-content/block/hero/hero.block.renderer";
import { renderHomepageHeroBlock } from "@rendering/body-content/block/homepage-hero/homepage-hero.block.renderer";
import { renderHomepageJournalListingBlock } from "@rendering/body-content/block/homepage-journal-listing/homepage-journal-listing.block.renderer";
import { renderHomepageNoteListingBlock } from "@rendering/body-content/block/homepage-note-listing/homepage-note-listing.block.renderer";
import { renderImageStripBlock } from "@rendering/body-content/block/image-strip/image-strip.block.renderer";
import { renderJournalListingBlock } from "@rendering/body-content/block/journal-listing/journal-listing.block.renderer";
import { renderNoteListingBlock } from "@rendering/body-content/block/note-listing/note-listing.block.renderer";
import { renderListBlock } from "@rendering/body-content/block/list/list.block.renderer";
import { renderParagraphBlock } from "@rendering/body-content/block/paragraph/paragraph.block.renderer";
import { renderPreBlock } from "@rendering/body-content/block/pre/pre.block.renderer";
import { renderQuoteBlock } from "@rendering/body-content/block/quote/quote.block.renderer";
import { renderSectionLinksBlock } from "@rendering/body-content/block/section-links/section-links.block.renderer";

jest.mock(
  "@rendering/body-content/block/article-section/article-section.block.renderer",
  () => ({
    renderArticleSectionBlock: jest.fn(),
  }),
);

jest.mock("@rendering/body-content/block/hero/hero.block.renderer", () => ({
  renderHeroBlock: jest.fn(),
}));

jest.mock(
  "@rendering/body-content/block/homepage-hero/homepage-hero.block.renderer",
  () => ({
    renderHomepageHeroBlock: jest.fn(),
  }),
);

jest.mock(
  "@rendering/body-content/block/homepage-journal-listing/homepage-journal-listing.block.renderer",
  () => ({
    renderHomepageJournalListingBlock: jest.fn(),
  }),
);

jest.mock(
  "@rendering/body-content/block/homepage-note-listing/homepage-note-listing.block.renderer",
  () => ({
    renderHomepageNoteListingBlock: jest.fn(),
  }),
);

jest.mock(
  "@rendering/body-content/block/image-strip/image-strip.block.renderer",
  () => ({
    renderImageStripBlock: jest.fn(),
  }),
);

jest.mock(
  "@rendering/body-content/block/journal-listing/journal-listing.block.renderer",
  () => ({
    renderJournalListingBlock: jest.fn(),
  }),
);

jest.mock(
  "@rendering/body-content/block/note-listing/note-listing.block.renderer",
  () => ({
    renderNoteListingBlock: jest.fn(),
  }),
);

jest.mock("@rendering/body-content/block/list/list.block.renderer", () => ({
  renderListBlock: jest.fn(),
}));

jest.mock(
  "@rendering/body-content/block/paragraph/paragraph.block.renderer",
  () => ({
    renderParagraphBlock: jest.fn(),
  }),
);

jest.mock("@rendering/body-content/block/pre/pre.block.renderer", () => ({
  renderPreBlock: jest.fn(),
}));

jest.mock("@rendering/body-content/block/quote/quote.block.renderer", () => ({
  renderQuoteBlock: jest.fn(),
}));

jest.mock(
  "@rendering/body-content/block/section-links/section-links.block.renderer",
  () => ({
    renderSectionLinksBlock: jest.fn(),
  }),
);

describe("renderBlock", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest
      .mocked(renderArticleSectionBlock)
      .mockReturnValue("<section>article section</section>");
    jest.mocked(renderHeroBlock).mockReturnValue("<figure>hero</figure>");
    jest
      .mocked(renderHomepageHeroBlock)
      .mockReturnValue("<section>homepage hero</section>");
    jest
      .mocked(renderHomepageJournalListingBlock)
      .mockReturnValue("<section>homepage journal listing</section>");
    jest
      .mocked(renderHomepageNoteListingBlock)
      .mockReturnValue("<section>homepage note listing</section>");
    jest
      .mocked(renderImageStripBlock)
      .mockReturnValue("<section>image strip</section>");
    jest
      .mocked(renderJournalListingBlock)
      .mockReturnValue("<section>journal listing</section>");
    jest
      .mocked(renderNoteListingBlock)
      .mockReturnValue("<section>note listing</section>");
    jest.mocked(renderListBlock).mockReturnValue("<ul>list</ul>");
    jest.mocked(renderParagraphBlock).mockReturnValue("<p>paragraph</p>");
    jest.mocked(renderPreBlock).mockReturnValue("<pre>pre</pre>");
    jest.mocked(renderQuoteBlock).mockReturnValue("<figure>quote</figure>");
    jest
      .mocked(renderSectionLinksBlock)
      .mockReturnValue("<section>section links</section>");
  });

  it.each([
    ["paragraph", renderParagraphBlock, "<p>paragraph</p>"],
    ["list", renderListBlock, "<ul>list</ul>"],
    ["quote", renderQuoteBlock, "<figure>quote</figure>"],
    ["hero", renderHeroBlock, "<figure>hero</figure>"],
    [
      "journalListing",
      renderJournalListingBlock,
      "<section>journal listing</section>",
    ],
    ["noteListing", renderNoteListingBlock, "<section>note listing</section>"],
    ["pre", renderPreBlock, "<pre>pre</pre>"],
    [
      "articleSection",
      renderArticleSectionBlock,
      "<section>article section</section>",
    ],
    [
      "homepageHero",
      renderHomepageHeroBlock,
      "<section>homepage hero</section>",
    ],
    ["imageStrip", renderImageStripBlock, "<section>image strip</section>"],
    [
      "homepageJournalListing",
      renderHomepageJournalListingBlock,
      "<section>homepage journal listing</section>",
    ],
    [
      "homepageNoteListing",
      renderHomepageNoteListingBlock,
      "<section>homepage note listing</section>",
    ],
    [
      "sectionLinks",
      renderSectionLinksBlock,
      "<section>section links</section>",
    ],
  ] as const)(
    "dispatches %s blocks to the matching renderer",
    (kind, renderer, expected) => {
      const module = { kind } as AppRenderContextBlock;

      expect(renderBlock(module)).toBe(expected);
      expect(jest.mocked(renderer)).toHaveBeenCalledWith(module);
    },
  );
});
