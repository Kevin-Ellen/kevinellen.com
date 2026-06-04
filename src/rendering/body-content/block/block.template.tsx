// src/rendering/body-content/block/block.template.tsx

import type { ReactNode } from "react";

import type { AppRenderContextBlock } from "@shared-types/page-content/block/app-render-context.block.types";

import { ArticleSectionBlockTemplate } from "@rendering/body-content/block/article-section/article-section.block.template";
import { HeroBlockTemplate } from "@rendering/body-content/block/hero/hero.block.template";
import { HomepageHeroBlockTemplate } from "@rendering/body-content/block/homepage-hero/homepage-hero.block.template";
import { HomepageJournalListingBlockTemplate } from "@rendering/body-content/block/homepage-journal-listing/homepage-journal-listing.block.template";
import { HomepageNoteListingBlockTemplate } from "@rendering/body-content/block/homepage-note-listing/homepage-note-listing.block.template";
import { ImageStripBlockTemplate } from "@rendering/body-content/block/image-strip/image-strip.block.template";
import { JournalListingBlockTemplate } from "@rendering/body-content/block/journal-listing/journal-listing.block.template";
import { ListBlockTemplate } from "@rendering/body-content/block/list/list.block.template";
import { NoteListingBlockTemplate } from "@rendering/body-content/block/note-listing/note-listing.block.template";
import { ParagraphBlockTemplate } from "@rendering/body-content/block/paragraph/paragraph.block.template";
import { PreBlockTemplate } from "@rendering/body-content/block/pre/pre.block.template";
import { QuoteBlockTemplate } from "@rendering/body-content/block/quote/quote.block.template";
import { SectionLinksBlockTemplate } from "@rendering/body-content/block/section-links/section-links.block.template";
import { SequenceBlockTemplate } from "@rendering/body-content/block/sequence/sequence.block.template";

type BlockRendererMap = Readonly<{
  [K in AppRenderContextBlock["kind"]]: (
    block: Extract<AppRenderContextBlock, { kind: K }>,
  ) => ReactNode;
}>;

const blockTemplates = {
  paragraph: (block) => <ParagraphBlockTemplate block={block} />,
  list: (block) => <ListBlockTemplate block={block} />,
  quote: (block) => <QuoteBlockTemplate block={block} />,
  hero: (block) => <HeroBlockTemplate block={block} />,
  journalListing: (block) => <JournalListingBlockTemplate block={block} />,
  pre: (block) => <PreBlockTemplate block={block} />,
  articleSection: (block) => <ArticleSectionBlockTemplate block={block} />,
  homepageHero: (block) => <HomepageHeroBlockTemplate block={block} />,
  imageStrip: (block) => <ImageStripBlockTemplate block={block} />,
  homepageJournalListing: (block) => (
    <HomepageJournalListingBlockTemplate block={block} />
  ),
  sectionLinks: (block) => <SectionLinksBlockTemplate block={block} />,
  noteListing: (block) => <NoteListingBlockTemplate block={block} />,
  homepageNoteListing: (block) => (
    <HomepageNoteListingBlockTemplate block={block} />
  ),
  sequence: (block) => <SequenceBlockTemplate block={block} />,
} satisfies BlockRendererMap;

type BlockTemplateProps = Readonly<{
  block: AppRenderContextBlock;
}>;

export const BlockTemplate = ({ block }: BlockTemplateProps) => {
  const renderer = blockTemplates[block.kind] as (
    block: AppRenderContextBlock,
  ) => ReactNode;

  return renderer(block);
};
