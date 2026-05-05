// src/rendering/body-content/block/article-section.body-content.renderer.ts

import type { AppRenderContextArticleSectionBlockContentModule } from "@shared-types/page-content/block/article-section/app-render-context.article-section.block.page-content.types";

import { renderBlockContentModule } from "@rendering/body-content/block/block.body-content.renderer";
import { renderHeading } from "@rendering/shared/heading.body-content.renderer";

export const renderArticleSectionBlockContentModule = (
  module: AppRenderContextArticleSectionBlockContentModule,
): string => {
  return `<section class="m-articleSection">
    ${renderHeading(module.heading, { className: "l-content" })}
    ${module.modules.map(renderBlockContentModule).join("")}
  </section>`;
};
