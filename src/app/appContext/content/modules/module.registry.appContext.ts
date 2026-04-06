// src/app/appContext/content/modules/module.registry.appContext.ts

import type { AppContextContentModule } from "@app/appContext/content/content.appContext.types";
import type { AppState } from "@app/appState/class.appState";
import type { ContentModuleAuthored } from "@shared-types/content/modules/index.content.module.types";

import { resolveParagraphAppContext } from "@app/appContext/content/modules/paragraph/paragraph.resolve.appContext";
import { resolveQuoteAppContext } from "@app/appContext/content/modules/quote/quote.resolve.appContext";
import { resolveListAppContext } from "@app/appContext/content/modules/list/list.resolve.appContext";

type ModuleResolver<TAuthoredModule extends ContentModuleAuthored> = (
  module: TAuthoredModule,
  appState: AppState,
) => AppContextContentModule;

type ModulesRegistry = {
  [K in ContentModuleAuthored["kind"]]: ModuleResolver<
    Extract<ContentModuleAuthored, { kind: K }>
  >;
};

export const CONTENT_MODULE_RESOLVERS_REGISTRY: ModulesRegistry = {
  paragraph: resolveParagraphAppContext,
  quote: resolveQuoteAppContext,
  list: resolveListAppContext,
};

export const resolveContentModuleAppContext = <
  TModule extends ContentModuleAuthored,
>(
  module: TModule,
  appState: AppState,
): AppContextContentModule => {
  const resolver = CONTENT_MODULE_RESOLVERS_REGISTRY[
    module.kind
  ] as ModuleResolver<TModule>;

  return resolver(module, appState);
};
