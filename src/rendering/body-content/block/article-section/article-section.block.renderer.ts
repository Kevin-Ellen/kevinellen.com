// src/rendering/body-content/block/article-section/article-section.block.renderer.ts

import type { AppRenderContextArticleSectionBlock } from "@shared-types/page-content/block/article-section/app-render-context.article-section.block.types";

import { renderBlock } from "@rendering/body-content/block/block.renderer";
import { renderHeading } from "@rendering/shared/heading.shared.renderer";

export const renderArticleSectionBlock = (
  module: AppRenderContextArticleSectionBlock,
): string => {
  return [
    `<section class="m-articleSection">`,
    renderHeading(module.heading, { className: "l-content" }),
    module.modules.map(renderBlock).join(""),
    `</section>`,
  ].join("");
};
