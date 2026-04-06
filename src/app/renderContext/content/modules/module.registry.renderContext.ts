// src/app/renderContext/content/modules/module.registry.renderContext.ts

import type { RenderContextContentModule } from "@app/renderContext/content/content.renderContext.types";
import type { AppContextContentModule } from "@app/appContext/content/content.appContext.types";

import { resolveParagraphRenderContext } from "@app/renderContext/content/modules/paragraph/paragraph.resolve.renderContext";
import { resolveQuoteRenderContext } from "@app/renderContext/content/modules/quote/quote.resolve.renderContext";
import { resolveListRenderContext } from "@app/renderContext/content/modules/list/list.resolve.renderContext";

type ModuleResolver<TAppModule extends AppContextContentModule> = (
  module: TAppModule,
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
};
