// src/rendering/body-content/block/hero.body-content.renderer.ts

import type { AppRenderContextHeroBlockContentModule } from "@shared-types/page-content/block/hero/app-render-context.hero.block.page-content.types";

import { escapeAttribute } from "@rendering/utils/html.escape.util.renderer";

import { getBlockFlowClass } from "@rendering/body-content/block/helpers/flow.block.body-content.helper";

export const renderHeroBlockContentModule = (
  module: AppRenderContextHeroBlockContentModule,
): string => {
  const immersiveClass = module.immersive ? " m-hero--immersive" : "";

  return `<figure class="m-contentBlock m-hero ${getBlockFlowClass(
    module.flow,
  )}${immersiveClass}" data-photo-id="${escapeAttribute(
    module.photoId,
  )}"></figure>`;
};
