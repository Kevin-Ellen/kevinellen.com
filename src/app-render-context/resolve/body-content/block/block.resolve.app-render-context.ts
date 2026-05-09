// src/app-render-context/resolve/body-content/block/block.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextBlock } from "@shared-types/page-content/block/app-context.block.types";
import type { AppRenderContextBlock } from "@shared-types/page-content/block/app-render-context.block.types";

import { appRenderContextResolveArticleSectionBlock } from "@app-render-context/resolve/body-content/block/article-section.resolve.app-render-context";
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

type BlockKind = AppContextBlock["kind"];

type BlockByKind<TKind extends BlockKind> = Extract<
  AppContextBlock,
  { kind: TKind }
>;

type BlockResolverRegistry = {
  [TKind in BlockKind]: (
    appContext: AppContext,
    block: BlockByKind<TKind>,
  ) => AppRenderContextBlock;
};

const BLOCK_RESOLVERS: BlockResolverRegistry = {
  articleSection: appRenderContextResolveArticleSectionBlock,
  hero: appRenderContextResolveHeroBlock,
  homepageHero: appRenderContextResolveHomepageHeroBlock,
  homepageJournalListing: appRenderContextResolveHomepageJournalListingBlock,
  imageStrip: appRenderContextResolveImageStripBlock,
  journalListing: appRenderContextResolveJournalListingBlock,
  list: appRenderContextResolveListBlock,
  paragraph: appRenderContextResolveParagraphBlock,
  pre: (_appContext, block) => appRenderContextResolvePreBlock(block),
  quote: (_appContext, block) => appRenderContextResolveQuoteBlock(block),
  sectionLinks: appRenderContextResolveSectionLinksBlock,
};

export const appRenderContextResolveBlock = <TKind extends BlockKind>(
  appContext: AppContext,
  block: BlockByKind<TKind>,
): AppRenderContextBlock => {
  const resolver = BLOCK_RESOLVERS[block.kind];

  if (!resolver) {
    throw new Error(
      `No AppRenderContext block resolver registered for kind: ${block.kind}`,
    );
  }

  return resolver(appContext, block as never);
};
