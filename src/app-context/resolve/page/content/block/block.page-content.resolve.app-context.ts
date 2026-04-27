// src/app-context/resolve/page/content/block/block.page-content.resolve.app-context.ts

import type { AppStateBlockContentModule } from "@shared-types/page-content/block/app-state.block.page-content.types";
import type { AppContextBlockContentModule } from "@shared-types/page-content/block/app-context.block.page-content.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

import { appContextResolveParagraphBlockContentModule } from "@app-context/resolve/page/content/block/paragraph.resolve.app-context";
import { appContextResolveListBlockContentModule } from "@app-context/resolve/page/content/block/list.resolve.app-context";
import { appContextResolveQuoteBlockContentModule } from "@app-context/resolve/page/content/block/quote.resolve.app-context";
import { appContextResolveHeroBlockContentModule } from "@app-context/resolve/page/content/block/hero.resolve.app-context";
import { appContextResolveJournalListingBlockContentModule } from "@app-context/resolve/page/content/block/journal-listing.resolve.app-context";
import { appContextResolvePreBlockContentModule } from "@app-context/resolve/page/content/block/pre.resolve.app-context";
import { appContextResolveArticleSectionBlockContentModule } from "@app-context/resolve/page/content/block/article-section.resolve.app-context";

type AppStateBlockContentModuleKind = AppStateBlockContentModule["kind"];

type AppStateBlockContentModuleByKind<
  TKey extends AppStateBlockContentModuleKind,
> = Extract<AppStateBlockContentModule, { kind: TKey }>;

type AppContextBlockContentModuleResolverRegistry = {
  [TKey in AppStateBlockContentModuleKind]: (
    module: AppStateBlockContentModuleByKind<TKey>,
    context: AppContextPageContentResolverContext,
  ) => AppContextBlockContentModule;
};

const getAppContextBlockContentModuleResolver = <
  TKind extends AppStateBlockContentModuleKind,
>(
  kind: TKind,
): AppContextBlockContentModuleResolverRegistry[TKind] => {
  const registry = {
    paragraph: appContextResolveParagraphBlockContentModule,
    list: appContextResolveListBlockContentModule,
    quote: appContextResolveQuoteBlockContentModule,
    hero: appContextResolveHeroBlockContentModule,
    journalListing: appContextResolveJournalListingBlockContentModule,
    pre: appContextResolvePreBlockContentModule,
    articleSection: appContextResolveArticleSectionBlockContentModule,
  } satisfies AppContextBlockContentModuleResolverRegistry;

  return registry[kind];
};

export const appContextResolveBlockContentModule = <
  TKind extends AppStateBlockContentModuleKind,
>(
  module: AppStateBlockContentModuleByKind<TKind>,
  context: AppContextPageContentResolverContext,
): AppContextBlockContentModule => {
  const resolver = getAppContextBlockContentModuleResolver(module.kind);

  if (!resolver) {
    throw new Error(
      `No AppContext block content resolver registered for kind: ${module.kind}`,
    );
  }

  return resolver(module, context);
};
