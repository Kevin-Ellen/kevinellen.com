// src/app/renderContext/content/modules/module.registry.renderContext.ts

import type { AppContextContentModule } from "@app/appContext/content/content.appContext.types";
import type { RenderContextContentModule } from "@app/renderContext/content/content.renderContext.types";
import type { RenderContextModuleResolverDependencies } from "./module.resolve.renderContext.types";

import { resolveParagraphRenderContext } from "@app/renderContext/content/modules/paragraph/paragraph.resolve.renderContext";
import { resolveQuoteRenderContext } from "@app/renderContext/content/modules/quote/quote.resolve.renderContext";
import { resolveListRenderContext } from "@app/renderContext/content/modules/list/list.resolve.renderContext";
import { resolveHeroRenderContext } from "@app/renderContext/content/modules/hero/hero.resolve.renderContext";
import { resolveJournalListingRenderContext } from "@app/renderContext/content/modules/journalListing/journalListing.resolve.renderContext";

type ModuleResolver<TAppModule extends AppContextContentModule> = (
  module: TAppModule,
  dependencies: RenderContextModuleResolverDependencies,
) => RenderContextContentModule;

type ModulesRegistry = {
  [K in AppContextContentModule["kind"]]: ModuleResolver<
    Extract<AppContextContentModule, { kind: K }>
  >;
};

export const CONTENT_MODULE_RESOLVERS_REGISTRY: ModulesRegistry = {
  paragraph: resolveParagraphRenderContext,
  quote: resolveQuoteRenderContext,
  list: resolveListRenderContext,
  hero: resolveHeroRenderContext,
  journalListing: resolveJournalListingRenderContext,
};
