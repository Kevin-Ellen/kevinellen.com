// src/app-context/resolve/page-content/block/block.resolve.app-context.ts

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";
import type { AppContextBlock } from "@shared-types/page-content/block/app-context.block.types";
import type { AppStateBlock } from "@shared-types/page-content/block/app-state.block.types";

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
import { appContextResolveNoteListingBlock } from "@app-context/resolve/page-content/block/note-listing.resolve.app-context";

type AppStateBlockKind = AppStateBlock["kind"];

type AppStateBlockByKind<TKind extends AppStateBlockKind> = Extract<
  AppStateBlock,
  { kind: TKind }
>;

type AppContextBlockResolverRegistry = {
  [TKind in AppStateBlockKind]: (
    block: AppStateBlockByKind<TKind>,
    context: AppContextPageContentResolverContext,
  ) => AppContextBlock;
};

const APP_CONTEXT_BLOCK_RESOLVER_REGISTRY = {
  paragraph: appContextResolveParagraphBlock,
  list: appContextResolveListBlock,
  quote: appContextResolveQuoteBlock,
  hero: appContextResolveHeroBlock,
  journalListing: appContextResolveJournalListingBlock,
  pre: appContextResolvePreBlock,
  articleSection: appContextResolveArticleSectionBlock,
  homepageHero: appContextResolveHomepageHero,
  imageStrip: appContextResolveImageStripBlock,
  homepageJournalListing: appContextResolveHomepageJournalListingBlock,
  sectionLinks: appContextResolveSectionLinksBlock,
  noteListing: appContextResolveNoteListingBlock,
} satisfies AppContextBlockResolverRegistry;

export const appContextResolveBlock = <TKind extends AppStateBlockKind>(
  block: AppStateBlockByKind<TKind>,
  context: AppContextPageContentResolverContext,
): AppContextBlock => {
  const resolver = APP_CONTEXT_BLOCK_RESOLVER_REGISTRY[block.kind];

  return resolver(block as never, context);
};
