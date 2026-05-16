// src/rendering/body-content/block/article-section/article-section.block.template.tsx

import type { AppRenderContextArticleSectionBlock } from "@shared-types/page-content/block/article-section/app-render-context.article-section.block.types";

import { BlockTemplate } from "@rendering/body-content/block/block.template";
import { HeadingTemplate } from "@rendering/shared/heading.shared.template";

type ArticleSectionBlockTemplateProps = Readonly<{
  block: AppRenderContextArticleSectionBlock;
}>;

export const ArticleSectionBlockTemplate = ({
  block,
}: ArticleSectionBlockTemplateProps) => (
  <section className="m-articleSection">
    <HeadingTemplate heading={block.heading} className="l-content" />

    {block.modules.map((module, index) => (
      <BlockTemplate key={`article-section-module:${index}`} block={module} />
    ))}
  </section>
);
