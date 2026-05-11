// src/rendering/body-content/block/block.renderer.ts

import type { AppRenderContextBlock } from "@shared-types/page-content/block/app-render-context.block.types";

import { renderArticleSectionBlock } from "@rendering/body-content/block/article-section/article-section.block.renderer";
import { renderHeroBlock } from "@rendering/body-content/block/hero/hero.block.renderer";
import { renderHomepageHeroBlock } from "@rendering/body-content/block/homepage-hero/homepage-hero.block.renderer";
import { renderHomepageJournalListingBlock } from "@rendering/body-content/block/homepage-journal-listing/homepage-journal-listing.block.renderer";
import { renderImageStripBlock } from "@rendering/body-content/block/image-strip/image-strip.block.renderer";
import { renderJournalListingBlock } from "@rendering/body-content/block/journal-listing/journal-listing.block.renderer";
import { renderListBlock } from "@rendering/body-content/block/list/list.block.renderer";
import { renderParagraphBlock } from "@rendering/body-content/block/paragraph/paragraph.block.renderer";
import { renderPreBlock } from "@rendering/body-content/block/pre/pre.block.renderer";
import { renderQuoteBlock } from "@rendering/body-content/block/quote/quote.block.renderer";
import { renderSectionLinksBlock } from "@rendering/body-content/block/section-links/section-links.block.renderer";
import { renderNoteListingBlock } from "@rendering/body-content/block/note-listing/note-listing.block.renderer";
import { renderHomepageNoteListingBlock } from "@rendering/body-content/block/homepage-note-listing/homepage-note-listing.block.renderer";

type BlockRendererMap = Readonly<{
  [K in AppRenderContextBlock["kind"]]: (
    module: Extract<AppRenderContextBlock, { kind: K }>,
  ) => string;
}>;

const blockRenderers = {
  paragraph: renderParagraphBlock,
  list: renderListBlock,
  quote: renderQuoteBlock,
  hero: renderHeroBlock,
  journalListing: renderJournalListingBlock,
  pre: renderPreBlock,
  articleSection: renderArticleSectionBlock,
  homepageHero: renderHomepageHeroBlock,
  imageStrip: renderImageStripBlock,
  homepageJournalListing: renderHomepageJournalListingBlock,
  sectionLinks: renderSectionLinksBlock,
  noteListing: renderNoteListingBlock,
  homepageNoteListing: renderHomepageNoteListingBlock,
} satisfies BlockRendererMap;

export const renderBlock = (module: AppRenderContextBlock): string => {
  const renderer = blockRenderers[module.kind] as (
    module: AppRenderContextBlock,
  ) => string;

  return renderer(module);
};
