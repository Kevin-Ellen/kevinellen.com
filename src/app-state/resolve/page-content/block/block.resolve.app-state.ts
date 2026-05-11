// src/app-state/resolve/page-content/block/block.resolve.app-state.ts

import type { AuthoredBlock } from "@shared-types/page-content/block/authored.block.types";
import type { AppStateBlock } from "@shared-types/page-content/block/app-state.block.types";

import { appStateResolveParagraphBlock } from "@app-state/resolve/page-content/block/paragraph.resolve.app-state";
import { appStateResolveListBlock } from "@app-state/resolve/page-content/block/list.resolve.app-state";
import { appStateResolveQuoteBlock } from "@app-state/resolve/page-content/block/quote.resolve.app-state";
import { appStateResolveHeroBlock } from "@app-state/resolve/page-content/block/hero.resolve.app-state";
import { appStateResolveJournalListingBlock } from "@app-state/resolve/page-content/block/journal-listing.resolve.app-state";
import { appStateResolvePreBlock } from "@app-state/resolve/page-content/block/pre.resolve.app-state";
import { appStateResolveArticleSectionBlock } from "@app-state/resolve/page-content/block/article-section.resolve.app-state";
import { appStateResolveHomepageHeroBlock } from "@app-state/resolve/page-content/block/homepage-hero.resolve.app-state";
import { appStateResolveImageStripBlock } from "@app-state/resolve/page-content/block/image-strip.resolve.app-state";
import { appStateResolveHomepageJournalListingBlock } from "@app-state/resolve/page-content/block/homepage-journal-listing.resolve.app-state";
import { appStateResolveSectionLinksBlock } from "@app-state/resolve/page-content/block/section-links.resolve.app-state";
import { appStateResolveNoteListingBlock } from "@app-state/resolve/page-content/block/note-listing.resolve.app-state";

type BlockKind = AuthoredBlock["kind"];

type BlockByKind<TKey extends BlockKind> = Extract<
  AuthoredBlock,
  { kind: TKey }
>;

type AppStateBlockContentModuleResolverRegistry = {
  [TKey in BlockKind]: (module: BlockByKind<TKey>) => AppStateBlock;
};

const blockResolver = <TKind extends BlockKind>(
  kind: TKind,
): AppStateBlockContentModuleResolverRegistry[TKind] => {
  const registry = {
    paragraph: appStateResolveParagraphBlock,
    list: appStateResolveListBlock,
    quote: appStateResolveQuoteBlock,
    hero: appStateResolveHeroBlock,
    journalListing: appStateResolveJournalListingBlock,
    pre: appStateResolvePreBlock,
    articleSection: appStateResolveArticleSectionBlock,
    homepageHero: appStateResolveHomepageHeroBlock,
    imageStrip: appStateResolveImageStripBlock,
    homepageJournalListing: appStateResolveHomepageJournalListingBlock,
    sectionLinks: appStateResolveSectionLinksBlock,
    noteListing: appStateResolveNoteListingBlock,
  } satisfies AppStateBlockContentModuleResolverRegistry;

  return registry[kind];
};

export const appStateResolveBlock = <TKind extends BlockKind>(
  module: BlockByKind<TKind>,
): AppStateBlock => {
  const resolver = blockResolver(module.kind);

  if (!resolver) {
    throw new Error(
      `No AppState block content resolver registered for kind: ${module.kind}`,
    );
  }

  return resolver(module);
};
