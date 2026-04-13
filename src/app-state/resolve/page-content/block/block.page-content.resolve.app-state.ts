// src/app-state/resolve/page-content/block/block.page-content.resolve.app-state.ts

import type { AuthoredBlockContentModule } from "@shared-types/page-content/block/authored.block.page-content.types";
import type { AppStateBlockContentModule } from "@shared-types/page-content/block/app-state.block.page-content.types";

import { appStateResolveParagraphBlockContentModule } from "@app-state/resolve/page-content/block/paragraph.resolve.app-state";
import { appStateResolveListBlockContentModule } from "@app-state/resolve/page-content/block/list.resolve.app-state";
import { appStateResolveQuoteBlockContentModule } from "@app-state/resolve/page-content/block/quote.resolve.app-state";
import { appStateResolveHeroBlockContentModule } from "@app-state/resolve/page-content/block/hero.resolve.app-state";
import { appStateResolveJournalListingBlockContentModule } from "@app-state/resolve/page-content/block/journal-listing.resolve.app-state";
import { appStateResolvePreBlockContentModule } from "@app-state/resolve/page-content/block/pre.resolve.app-state";
import { appStateResolveContentSectionBlockContentModule } from "@app-state/resolve/page-content/block/content-section.resolve.app-state";

type AuthoredBlockContentModuleKind = AuthoredBlockContentModule["kind"];

type AuthoredBlockContentModuleByKind<
  TKey extends AuthoredBlockContentModuleKind,
> = Extract<AuthoredBlockContentModule, { kind: TKey }>;

type AppStateBlockContentModuleResolverRegistry = {
  [TKey in AuthoredBlockContentModuleKind]: (
    module: AuthoredBlockContentModuleByKind<TKey>,
  ) => AppStateBlockContentModule;
};

const getAppStateBlockContentModuleResolver = <
  TKind extends AuthoredBlockContentModuleKind,
>(
  kind: TKind,
): AppStateBlockContentModuleResolverRegistry[TKind] => {
  const registry = {
    paragraph: appStateResolveParagraphBlockContentModule,
    list: appStateResolveListBlockContentModule,
    quote: appStateResolveQuoteBlockContentModule,
    hero: appStateResolveHeroBlockContentModule,
    journalListing: appStateResolveJournalListingBlockContentModule,
    pre: appStateResolvePreBlockContentModule,
    contentSection: appStateResolveContentSectionBlockContentModule,
  } satisfies AppStateBlockContentModuleResolverRegistry;

  return registry[kind];
};

export const appStateResolveBlockContentModule = <
  TKind extends AuthoredBlockContentModuleKind,
>(
  module: AuthoredBlockContentModuleByKind<TKind>,
): AppStateBlockContentModule => {
  const resolver = getAppStateBlockContentModuleResolver(module.kind);

  if (!resolver) {
    throw new Error(
      `No AppState block content resolver registered for kind: ${module.kind}`,
    );
  }

  return resolver(module);
};
