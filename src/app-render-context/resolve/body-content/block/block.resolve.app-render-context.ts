// src/app-render-context/resolve/body-content/block/block.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextBlockContentModule } from "@shared-types/page-content/block/app-context.block.page-content.types";
import type { AppRenderContextBlockContentModule } from "@shared-types/page-content/block/app-render-context.block.page-content.types";

import { resolveParagraphBlockContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/block/paragraph.resolve.app-render-context";
import { resolveListBlockContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/block/list.resolve.app-render-context";
import { resolveQuoteBlockContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/block/quote.resolve.app-render-context";
import { resolveHeroBlockContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/block/hero.resolve.app-render-context";
import { resolveJournalListingBlockContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/block/journal-listing.resolve.app-render-context";
import { resolvePreBlockContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/block/pre.resolve.app-render-context";
import { resolveContentSectionBlockContentModuleAppRenderContext } from "@app-render-context/resolve/body-content/block/content-section.resolve.app-render-context";

type AppRenderContextBlockResolverMap = Readonly<{
  [K in AppContextBlockContentModule["kind"]]: (
    appContext: AppContext,
    module: Extract<AppContextBlockContentModule, { kind: K }>,
  ) => AppRenderContextBlockContentModule;
}>;

const blockContentModuleResolvers = {
  paragraph: resolveParagraphBlockContentModuleAppRenderContext,
  list: resolveListBlockContentModuleAppRenderContext,
  quote: resolveQuoteBlockContentModuleAppRenderContext,
  hero: resolveHeroBlockContentModuleAppRenderContext,
  journalListing: resolveJournalListingBlockContentModuleAppRenderContext,
  pre: resolvePreBlockContentModuleAppRenderContext,
  contentSection: resolveContentSectionBlockContentModuleAppRenderContext,
} satisfies AppRenderContextBlockResolverMap;

export const resolveBlockContentModuleAppRenderContext = (
  appContext: AppContext,
  module: AppContextBlockContentModule,
): AppRenderContextBlockContentModule => {
  const resolver = blockContentModuleResolvers[module.kind] as (
    appContext: AppContext,
    module: AppContextBlockContentModule,
  ) => AppRenderContextBlockContentModule;

  return resolver(appContext, module);
};
