// src/app/appContext/content/modules/module.resolve.appContext.ts

import type { AppContextContentModule } from "@app/appContext/content/content.appContext.types";
import type { ContentModuleAuthored } from "@shared-types/content/modules/index.content.module.types";

import {
  CONTENT_MODULE_RESOLVERS_REGISTRY,
  type AppContextModuleResolverDependencies,
} from "@app/appContext/content/modules/module.registry.appContext";

export const resolveContentModuleAppContext = (
  module: ContentModuleAuthored,
  dependencies: AppContextModuleResolverDependencies,
): AppContextContentModule => {
  const resolver = CONTENT_MODULE_RESOLVERS_REGISTRY[module.kind] as (
    module: ContentModuleAuthored,
    dependencies: AppContextModuleResolverDependencies,
  ) => AppContextContentModule;

  return resolver(module, dependencies);
};
