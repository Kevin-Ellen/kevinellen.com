// src/rendering/body-content/block/block.renderer.ts

import type { AppRenderContextBlock } from "@shared-types/page-content/block/app-render-context.block.types";

import { renderArticleSectionBlock } from "@rendering/body-content/block/article-section.block.renderer";
import { renderHeroBlock } from "@rendering/body-content/block/hero.block.renderer";
import { renderHomepageHeroBlock } from "@rendering/body-content/block/homepage-hero.block.renderer";
import { renderHomepageJournalListingBlock } from "@rendering/body-content/block/homepage-journal-listing.block.renderer";
import { renderImageStripBlock } from "@rendering/body-content/block/image-strip.block.renderer";
import { renderJournalListingBlock } from "@rendering/body-content/block/journal-listing.block.renderer";
import { renderListBlock } from "@rendering/body-content/block/list.block.renderer";
import { renderParagraphBlock } from "@rendering/body-content/block/paragraph.block.renderer";
import { renderPreBlock } from "@rendering/body-content/block/pre.block.renderer";
import { renderQuoteBlock } from "@rendering/body-content/block/quote.block.renderer";
import { renderSectionLinksBlock } from "@rendering/body-content/block/section-links.block.renderer";
import { renderNoteListingBlock } from "@rendering/body-content/block/note-listing.block.renderer";

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
} satisfies BlockRendererMap;

export const renderBlock = (module: AppRenderContextBlock): string => {
  const renderer = blockRenderers[module.kind] as (
    module: AppRenderContextBlock,
  ) => string;

  return renderer(module);
};
