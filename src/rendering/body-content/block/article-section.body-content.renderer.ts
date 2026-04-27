// src/rendering/body-content/block/article-section.body-content.renderer.ts

import type {
  AppRenderContextArticleSectionBlockContentModule,
  AppRenderContextArticleSectionHeading,
} from "@shared-types/page-content/block/article-section/app-render-context.article-section.block.page-content.types";

import { renderBlockContentModule } from "@rendering/body-content/block/block.body-content.renderer";
import { escapeHtml } from "@rendering/utils/html.escape.util.renderer";

const renderSectionHeading = (
  heading: AppRenderContextArticleSectionHeading,
): string => {
  const tag = `h${heading.level}`;
  const className = heading.visuallyHidden
    ? ` class="u-sr-only l-content"`
    : ` class="l-content"`;

  return `<${tag}${className}>${escapeHtml(heading.text)}</${tag}>`;
};

export const renderArticleSectionBlockContentModule = (
  module: AppRenderContextArticleSectionBlockContentModule,
): string => {
  return `<section class="m-articleSection">
    ${renderSectionHeading(module.heading)}
    ${module.modules.map(renderBlockContentModule).join("")}
  </section>`;
};
