// src/app/renderContext/content/modules/module.resolve.renderContext.ts

import type { AppContextContentModule } from "@app/appContext/content/content.appContext.types";
import type { RenderContextContentModule } from "@app/renderContext/content/content.renderContext.types";

import { CONTENT_MODULE_RESOLVERS_REGISTRY } from "@app/renderContext/content/modules/module.registry.renderContext";

export const resolveContentModuleRenderContext = (
  module: AppContextContentModule,
): RenderContextContentModule => {
  const resolver = CONTENT_MODULE_RESOLVERS_REGISTRY[module.kind] as (
    module: AppContextContentModule,
  ) => RenderContextContentModule;

  return resolver(module);
};
