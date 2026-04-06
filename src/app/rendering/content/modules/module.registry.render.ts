// src/app/rendering/content/modules/module.registry.render.ts

import type { RenderContextContentModule } from "@app/renderContext/content/content.renderContext.types";

import { renderParagraphModule } from "@app/rendering/content/modules/paragraph/paragraph.render.module";
import { quoteRenderModule } from "@app/rendering/content/modules/quote/quote.render.module";

type ModuleRenderer<TModule extends RenderContextContentModule> = (
  module: TModule,
) => string;

type ModulesRegistry = {
  [K in RenderContextContentModule["kind"]]: ModuleRenderer<
    Extract<RenderContextContentModule, { kind: K }>
  >;
};

export const MODULE_RENDERERS_REGISTRY: ModulesRegistry = {
  paragraph: renderParagraphModule,
  quote: quoteRenderModule,
};
