// src/app/appContext/content/modules/module.registry.appContext.ts

import type { AppContextContentModule } from "@app/appContext/content/content.appContext.types";
import type { AppState } from "@app/appState/class.appState";
import type { ContentModuleAuthored } from "@shared-types/content/modules/index.content.module.types";
import type {
  AppContextPhotoId,
  AppContextPhoto,
} from "@app/appContext/appContext.types";

import { resolveParagraphAppContext } from "@app/appContext/content/modules/paragraph/paragraph.resolve.appContext";
import { resolveQuoteAppContext } from "@app/appContext/content/modules/quote/quote.resolve.appContext";
import { resolveListAppContext } from "@app/appContext/content/modules/list/list.resolve.appContext";
import { resolveHeroAppContext } from "@app/appContext/content/modules/hero/hero.resolve.appContext";

export type AppContextModuleResolverDependencies = {
  appState: AppState;
  getPhotoRecordById: (id: AppContextPhotoId) => AppContextPhoto;
};

type ModuleResolver<TAuthoredModule extends ContentModuleAuthored> = (
  module: TAuthoredModule,
  dependencies: AppContextModuleResolverDependencies,
) => AppContextContentModule;

type ModulesRegistry = {
  [K in ContentModuleAuthored["kind"]]: ModuleResolver<
    Extract<ContentModuleAuthored, { kind: K }>
  >;
};

export const resolveContentModuleAppContext = <
  TModule extends ContentModuleAuthored,
>(
  module: TModule,
  dependencies: AppContextModuleResolverDependencies,
): AppContextContentModule => {
  const resolver = CONTENT_MODULE_RESOLVERS_REGISTRY[
    module.kind
  ] as ModuleResolver<TModule>;

  return resolver(module, dependencies);
};

export const CONTENT_MODULE_RESOLVERS_REGISTRY: ModulesRegistry = {
  paragraph: resolveParagraphAppContext,
  quote: resolveQuoteAppContext,
  list: resolveListAppContext,
  hero: resolveHeroAppContext,
};
