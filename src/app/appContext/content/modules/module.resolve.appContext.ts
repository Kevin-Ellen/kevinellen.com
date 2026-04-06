// src/app/appContext/content/modules/module.resolve.appContext.ts

import type { AppContextContentModule } from "@app/appContext/content/content.appContext.types";
import type { AppState } from "@app/appState/class.appState";
import type { ContentModuleAuthored } from "@shared-types/content/modules/index.content.module.types";

import { CONTENT_MODULE_RESOLVERS_REGISTRY } from "@app/appContext/content/modules/module.registry.appContext";

export const resolveContentModuleAppContext = (
  module: ContentModuleAuthored,
  appState: AppState,
): AppContextContentModule => {
  const resolver = CONTENT_MODULE_RESOLVERS_REGISTRY[module.kind] as (
    module: ContentModuleAuthored,
    appState: AppState,
  ) => AppContextContentModule;

  return resolver(module, appState);
};
