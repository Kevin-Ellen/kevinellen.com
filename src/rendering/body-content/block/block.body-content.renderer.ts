// src/rendering/body-content/block/block.body-content.renderer.ts

import type { AppRenderContextBlockContentModule } from "@shared-types/page-content/block/app-render-context.block.page-content.types";

import { renderParagraphBlockContentModule } from "@rendering/body-content/block/paragraph.body-content.renderer";
import { renderListBlockContentModule } from "@rendering/body-content/block/list.body-content.renderer";
import { renderQuoteBlockContentModule } from "@rendering/body-content/block/quote.body-content.renderer";
import { renderHeroBlockContentModule } from "@rendering/body-content/block/hero.body-content.renderer";
import { renderJournalListingBlockContentModule } from "@rendering/body-content/block/journal-listing.body-content.renderer";
import { renderPreBlockContentModule } from "@rendering/body-content/block/pre.body-content.renderer";
import { renderArticleSectionBlockContentModule } from "@rendering/body-content/block/article-section.body-content.renderer";

type AppRenderContextBlockRendererMap = Readonly<{
  [K in AppRenderContextBlockContentModule["kind"]]: (
    module: Extract<AppRenderContextBlockContentModule, { kind: K }>,
  ) => string;
}>;

const blockContentModuleRenderers = {
  paragraph: renderParagraphBlockContentModule,
  list: renderListBlockContentModule,
  quote: renderQuoteBlockContentModule,
  hero: renderHeroBlockContentModule,
  journalListing: renderJournalListingBlockContentModule,
  pre: renderPreBlockContentModule,
  articleSection: renderArticleSectionBlockContentModule,
} satisfies AppRenderContextBlockRendererMap;

export const renderBlockContentModule = (
  module: AppRenderContextBlockContentModule,
): string => {
  const renderer = blockContentModuleRenderers[module.kind] as (
    module: AppRenderContextBlockContentModule,
  ) => string;

  return renderer(module);
};
