// src/app/rendering/content/module.render.ts

import type { RenderContextContentModule } from "@app/renderContext/content/content.renderContext.types";

import { MODULE_RENDERERS_REGISTRY } from "@app/rendering/content/modules/module.registry.render";

export const renderContentLeafModule = (
  module: RenderContextContentModule,
): string => {
  const renderer = MODULE_RENDERERS_REGISTRY[module.kind] as (
    module: RenderContextContentModule,
  ) => string;

  return renderer(module);
};
